const db = require('../config/db');

const getStudentDrivesWithEligibility = async (studentId) => {
  // 1. Fetch Student Profile with academic info
  const studentRes = await db.query(
    `SELECT 
      s.*,
      COALESCE(s.cgpa, (SELECT MAX(cgpa) FROM student_semester_cgpa WHERE student_id = s.student_id), 0.00) AS effective_cgpa
     FROM students s 
     WHERE s.student_id = $1`,
    [studentId]
  );
  const student = studentRes.rows[0];
  if (!student) return [];

  // 2. Fetch accepted offer if any (Rule 5)
  const offerRes = await db.query(
    `SELECT o.package_lpa, c.company_name 
     FROM offers o 
     JOIN companies c ON o.company_id = c.company_id 
     WHERE o.student_id = $1 AND o.accepted = TRUE 
     LIMIT 1`,
    [studentId]
  );
  const acceptedOffer = offerRes.rows[0] || null;

  // 3. Fetch all active/upcoming/ongoing companies with criteria and student's application status
  const query = `
    SELECT 
      c.company_id, c.company_name, c.job_profile, c.job_description, 
      c.package_lpa, c.job_type, c.location, c.visit_date, c.status AS drive_status,
      cc.minimum_cgpa, cc.maximum_backlogs, cc.minimum_10th, cc.minimum_12th,
      cc.minimum_diploma, cc.allowed_year, cc.gender_requirement,
      COALESCE(ARRAY_AGG(DISTINCT cab.branch) FILTER (WHERE cab.branch IS NOT NULL), '{}') AS allowed_branches,
      COALESCE(ARRAY_AGG(DISTINCT cal.location_zone) FILTER (WHERE cal.location_zone IS NOT NULL), '{}') AS allowed_locations,
      a.application_id, a.status AS application_status, a.applied_on, a.skills AS applied_skills, a.resume_url AS applied_resume
    FROM companies c
    LEFT JOIN company_criteria cc ON c.company_id = cc.company_id
    LEFT JOIN company_allowed_branches cab ON c.company_id = cab.company_id
    LEFT JOIN company_allowed_locations cal ON c.company_id = cal.company_id
    LEFT JOIN applications a ON c.company_id = a.company_id AND a.student_id = $1
    WHERE c.status IN ('Upcoming', 'Ongoing')
    GROUP BY c.company_id, cc.criteria_id, a.application_id
    ORDER BY c.package_lpa DESC, c.company_id DESC
  `;
  const compResult = await db.query(query, [studentId]);

  // 4. Calculate detailed eligibility and explicit reasons for each company
  return compResult.rows.map((comp) => {
    const reasons = [];

    // Academic Criteria Recorded Check
    if (!student.academic_recorded) {
      reasons.push('Academic criteria not recorded yet. Please submit your CGPA, 10th %, 12th % and backlogs to verify eligibility.');
    } else {
      // 1. CGPA Check
      const studentCgpa = Number(student.effective_cgpa || student.cgpa || 0);
      const minCgpa = Number(comp.minimum_cgpa || 0);
      if (studentCgpa < minCgpa) {
        reasons.push(`CGPA is below requirement: Your CGPA is ${studentCgpa.toFixed(2)}, required cutoff is ${minCgpa.toFixed(2)}.`);
      }

      // 2. Backlogs Check
      const activeBacklogs = Number(student.active_backlogs || 0);
      const maxBacklogs = Number(comp.maximum_backlogs ?? 0);
      if (activeBacklogs > maxBacklogs) {
        reasons.push(`Exceeds maximum backlogs limit: You have ${activeBacklogs} active backlog(s), company permits maximum ${maxBacklogs}.`);
      }

      // 3. 10th Standard Check
      const tenth = Number(student.tenth_percentage || 0);
      const min10th = Number(comp.minimum_10th || 0);
      if (min10th > 0 && tenth < min10th) {
        reasons.push(`10th percentage below cutoff: You scored ${tenth.toFixed(1)}%, required minimum is ${min10th.toFixed(1)}%.`);
      }

      // 4. 12th / Diploma Check
      const twelfth = Number(student.twelfth_percentage || 0);
      const diploma = Number(student.diploma_percentage || 0);
      const min12th = Number(comp.minimum_12th || 0);
      const minDiploma = Number(comp.minimum_diploma || 0);
      if (min12th > 0 && twelfth < min12th && diploma < minDiploma) {
        reasons.push(`12th / Diploma percentage below cutoff: Required ${min12th}% in 12th (or ${minDiploma}% in Diploma). Your score: 12th (${twelfth}%), Diploma (${diploma}%).`);
      }

      // 5. Allowed Branch Check
      if (comp.allowed_branches && comp.allowed_branches.length > 0) {
        if (!comp.allowed_branches.includes(student.branch)) {
          reasons.push(`Branch not eligible: Open only for [${comp.allowed_branches.join(', ')}]. Your branch is ${student.branch}.`);
        }
      }

      // 6. Gender Check
      if (comp.gender_requirement && comp.gender_requirement !== 'Any') {
        if (comp.gender_requirement.toLowerCase() !== String(student.gender || '').toLowerCase()) {
          reasons.push(`Gender requirement: Company hiring drive is designated for ${comp.gender_requirement} candidates only.`);
        }
      }

      // 7. Year of Study Check
      if (comp.allowed_year && Number(student.current_year) !== Number(comp.allowed_year)) {
        reasons.push(`Study year criteria: Open for Year ${comp.allowed_year} students only. You are in Year ${student.current_year}.`);
      }

      // 8. Policy Rule 5 Check (₹5 LPA upgrade constraint)
      if (acceptedOffer) {
        const diff = Number(acceptedOffer.package_lpa) - Number(comp.package_lpa);
        if (diff > 5.0) {
          reasons.push(`Rule 5 Policy: You already accepted an offer from ${acceptedOffer.company_name} (₹${acceptedOffer.package_lpa} LPA). You can only apply to drives offering at least ₹${(Number(acceptedOffer.package_lpa) - 5).toFixed(2)} LPA.`);
        }
      }
    }

    const isEligible = reasons.length === 0;

    return {
      ...comp,
      is_eligible: isEligible,
      eligibility_reasons: reasons,
      has_applied: Boolean(comp.application_id)
    };
  });
};

const applyForCompany = async (studentId, { company_id, skills, resume_url, cover_note }) => {
  // Sync skills & resume_url to student profile if provided
  if (skills && Array.isArray(skills) && skills.length > 0) {
    await db.query('UPDATE students SET skills = $1 WHERE student_id = $2', [skills, studentId]);
  }
  if (resume_url) {
    await db.query('UPDATE students SET resume_url = $1 WHERE student_id = $2', [resume_url, studentId]);
  }

  const query = `
    INSERT INTO applications (student_id, company_id, status, skills, resume_url, cover_note, applied_on)
    VALUES ($1, $2, 'Applied', $3, $4, $5, CURRENT_TIMESTAMP)
    ON CONFLICT (student_id, company_id) DO UPDATE SET
      skills = EXCLUDED.skills,
      resume_url = EXCLUDED.resume_url,
      cover_note = EXCLUDED.cover_note,
      status = 'Applied',
      applied_on = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const result = await db.query(query, [
    studentId,
    company_id,
    skills || [],
    resume_url || null,
    cover_note || null
  ]);
  return result.rows[0];
};

const getMyApplications = async (studentId) => {
  const query = `
    SELECT 
      a.application_id, a.status, a.applied_on, a.skills, a.resume_url, a.cover_note,
      c.company_id, c.company_name, c.job_profile, c.package_lpa, c.location, c.visit_date
    FROM applications a
    JOIN companies c ON a.company_id = c.company_id
    WHERE a.student_id = $1
    ORDER BY a.applied_on DESC
  `;
  const result = await db.query(query, [studentId]);
  return result.rows;
};

const getCompanyApplications = async (companyId) => {
  const query = `
    SELECT 
      a.application_id, a.status, a.applied_on, a.skills, a.resume_url, a.cover_note,
      s.student_id, s.roll_no, s.first_name, s.last_name, s.college_email, s.phone, s.branch, s.current_year, s.location_zone,
      COALESCE(s.cgpa, (SELECT MAX(cgpa) FROM student_semester_cgpa WHERE student_id = s.student_id), 0.00) AS latest_cgpa
    FROM applications a
    JOIN students s ON a.student_id = s.student_id
    WHERE a.company_id = $1
    ORDER BY a.applied_on DESC
  `;
  const result = await db.query(query, [companyId]);
  return result.rows;
};

const updateStatus = async (applicationId, status) => {
  const query = `
    UPDATE applications
    SET status = $1
    WHERE application_id = $2
    RETURNING *
  `;
  const result = await db.query(query, [status, applicationId]);
  return result.rows[0];
};

const bulkUpdateStatus = async (companyId, studentIds, status) => {
  const query = `
    UPDATE applications
    SET status = $1
    WHERE company_id = $2 AND student_id = ANY($3::int[])
    RETURNING *
  `;
  const result = await db.query(query, [status, companyId, studentIds]);
  return result.rows;
};

module.exports = {
  getStudentDrivesWithEligibility,
  applyForCompany,
  getMyApplications,
  getCompanyApplications,
  updateStatus,
  bulkUpdateStatus
};
