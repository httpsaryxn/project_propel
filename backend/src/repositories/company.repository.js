const db = require('../config/db');

const sanitizeDate = (val) => {
  if (!val || String(val).trim() === '') return null;
  return val;
};

const sanitizeString = (val) => {
  if (!val || String(val).trim() === '') return null;
  return val;
};

const findAll = async (filters = {}) => {
  let query = `
    SELECT 
      c.*,
      cc.minimum_cgpa, cc.maximum_backlogs, cc.minimum_10th, cc.minimum_12th, 
      cc.minimum_diploma, cc.allowed_year, cc.gender_requirement,
      COALESCE(ARRAY_AGG(DISTINCT cab.branch) FILTER (WHERE cab.branch IS NOT NULL), '{}') AS allowed_branches,
      COALESCE(ARRAY_AGG(DISTINCT cal.location_zone) FILTER (WHERE cal.location_zone IS NOT NULL), '{}') AS allowed_locations
    FROM companies c
    LEFT JOIN company_criteria cc ON c.company_id = cc.company_id
    LEFT JOIN company_allowed_branches cab ON c.company_id = cab.company_id
    LEFT JOIN company_allowed_locations cal ON c.company_id = cal.company_id
  `;

  const whereConditions = [];
  const queryParams = [];

  if (filters.status) {
    queryParams.push(filters.status);
    whereConditions.push(`c.status = $${queryParams.length}`);
  }

  if (filters.search) {
    queryParams.push(`%${filters.search}%`);
    whereConditions.push(`(c.company_name ILIKE $${queryParams.length} OR c.job_profile ILIKE $${queryParams.length})`);
  }

  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }

  query += ` GROUP BY c.company_id, cc.criteria_id ORDER BY c.created_at DESC`;

  const result = await db.query(query, queryParams);
  return result.rows;
};

const findById = async (id) => {
  const query = `
    SELECT 
      c.*,
      cc.minimum_cgpa, cc.maximum_backlogs, cc.minimum_10th, cc.minimum_12th, 
      cc.minimum_diploma, cc.allowed_year, cc.gender_requirement,
      COALESCE(ARRAY_AGG(DISTINCT cab.branch) FILTER (WHERE cab.branch IS NOT NULL), '{}') AS allowed_branches,
      COALESCE(ARRAY_AGG(DISTINCT cal.location_zone) FILTER (WHERE cal.location_zone IS NOT NULL), '{}') AS allowed_locations
    FROM companies c
    LEFT JOIN company_criteria cc ON c.company_id = cc.company_id
    LEFT JOIN company_allowed_branches cab ON c.company_id = cab.company_id
    LEFT JOIN company_allowed_locations cal ON c.company_id = cal.company_id
    WHERE c.company_id = $1
    GROUP BY c.company_id, cc.criteria_id
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const createCompany = async (data) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert Company with sanitized date and text fields
    const compRes = await client.query(
      `INSERT INTO companies (
        company_name, job_profile, job_description, package_lpa, job_type, 
        location, visit_date, hr_name, hr_email, hr_contact, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        data.company_name,
        data.job_profile,
        sanitizeString(data.job_description),
        data.package_lpa,
        data.job_type || 'Full-Time',
        sanitizeString(data.location),
        sanitizeDate(data.visit_date),
        sanitizeString(data.hr_name),
        sanitizeString(data.hr_email),
        sanitizeString(data.hr_contact),
        data.status || 'Upcoming'
      ]
    );

    const newCompany = compRes.rows[0];
    const companyId = newCompany.company_id;

    // 2. Insert Criteria
    await client.query(
      `INSERT INTO company_criteria (
        company_id, minimum_cgpa, maximum_backlogs, minimum_10th, minimum_12th, 
        minimum_diploma, allowed_year, gender_requirement
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        companyId,
        data.minimum_cgpa ?? 0.0,
        data.maximum_backlogs ?? 0,
        data.minimum_10th ?? 0.0,
        data.minimum_12th ?? 0.0,
        data.minimum_diploma ?? 0.0,
        data.allowed_year ?? 4,
        data.gender_requirement || 'Any'
      ]
    );

    // 3. Insert Allowed Branches
    if (data.allowed_branches && Array.isArray(data.allowed_branches)) {
      for (const branch of data.allowed_branches) {
        await client.query(
          `INSERT INTO company_allowed_branches (company_id, branch) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [companyId, branch]
        );
      }
    }

    // 4. Insert Allowed Locations
    if (data.allowed_locations && Array.isArray(data.allowed_locations)) {
      for (const zone of data.allowed_locations) {
        await client.query(
          `INSERT INTO company_allowed_locations (company_id, location_zone) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [companyId, zone]
        );
      }
    }

    // 5. Sync to Company Visits Table if visit date provided
    if (sanitizeDate(data.visit_date)) {
      await client.query(
        `INSERT INTO company_visits (company_id, visit_date, venue, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [
          companyId,
          sanitizeDate(data.visit_date),
          sanitizeString(data.location) || 'Campus Placement Cell',
          sanitizeString(data.job_description) || `${data.company_name} - ${data.job_profile} Campus Drive`
        ]
      );
    }

    await client.query('COMMIT');
    return findById(companyId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateCompany = async (id, data) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update Company with sanitized date and text fields
    await client.query(
      `UPDATE companies SET
        company_name = COALESCE($1, company_name),
        job_profile = COALESCE($2, job_profile),
        job_description = $3,
        package_lpa = COALESCE($4, package_lpa),
        job_type = COALESCE($5, job_type),
        location = $6,
        visit_date = $7,
        hr_name = $8,
        hr_email = $9,
        hr_contact = $10,
        status = COALESCE($11, status)
      WHERE company_id = $12`,
      [
        sanitizeString(data.company_name),
        sanitizeString(data.job_profile),
        sanitizeString(data.job_description),
        data.package_lpa,
        data.job_type,
        sanitizeString(data.location),
        sanitizeDate(data.visit_date),
        sanitizeString(data.hr_name),
        sanitizeString(data.hr_email),
        sanitizeString(data.hr_contact),
        data.status,
        id
      ]
    );

    // 2. Update Criteria
    await client.query(
      `INSERT INTO company_criteria (
        company_id, minimum_cgpa, maximum_backlogs, minimum_10th, minimum_12th, 
        minimum_diploma, allowed_year, gender_requirement
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (company_id) DO UPDATE SET
        minimum_cgpa = EXCLUDED.minimum_cgpa,
        maximum_backlogs = EXCLUDED.maximum_backlogs,
        minimum_10th = EXCLUDED.minimum_10th,
        minimum_12th = EXCLUDED.minimum_12th,
        minimum_diploma = EXCLUDED.minimum_diploma,
        allowed_year = EXCLUDED.allowed_year,
        gender_requirement = EXCLUDED.gender_requirement`,
      [
        id,
        data.minimum_cgpa ?? 0.0,
        data.maximum_backlogs ?? 0,
        data.minimum_10th ?? 0.0,
        data.minimum_12th ?? 0.0,
        data.minimum_diploma ?? 0.0,
        data.allowed_year ?? 4,
        data.gender_requirement ?? 'Any'
      ]
    );

    // 3. Update Branches if provided
    if (data.allowed_branches && Array.isArray(data.allowed_branches)) {
      await client.query('DELETE FROM company_allowed_branches WHERE company_id = $1', [id]);
      for (const branch of data.allowed_branches) {
        await client.query(
          'INSERT INTO company_allowed_branches (company_id, branch) VALUES ($1, $2)',
          [id, branch]
        );
      }
    }

    // 4. Update Locations if provided
    if (data.allowed_locations && Array.isArray(data.allowed_locations)) {
      await client.query('DELETE FROM company_allowed_locations WHERE company_id = $1', [id]);
      for (const zone of data.allowed_locations) {
        await client.query(
          'INSERT INTO company_allowed_locations (company_id, location_zone) VALUES ($1, $2)',
          [id, zone]
        );
      }
    }

    // 5. Sync Company Visits Table
    if (sanitizeDate(data.visit_date)) {
      const existingVisit = await client.query('SELECT visit_id FROM company_visits WHERE company_id = $1', [id]);
      if (existingVisit.rows.length > 0) {
        await client.query(
          `UPDATE company_visits SET visit_date = $1, venue = COALESCE($2, venue), description = COALESCE($3, description) WHERE company_id = $4`,
          [sanitizeDate(data.visit_date), sanitizeString(data.location), sanitizeString(data.job_description), id]
        );
      } else {
        await client.query(
          `INSERT INTO company_visits (company_id, visit_date, venue, description) VALUES ($1, $2, $3, $4)`,
          [id, sanitizeDate(data.visit_date), sanitizeString(data.location) || 'Campus Placement Cell', sanitizeString(data.job_description) || 'Campus Placement Drive']
        );
      }
    }

    await client.query('COMMIT');
    return findById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteCompany = async (id) => {
  const result = await db.query('DELETE FROM companies WHERE company_id = $1 RETURNING company_id', [id]);
  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  createCompany,
  updateCompany,
  deleteCompany
};
