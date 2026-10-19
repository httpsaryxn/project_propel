const path = require('path');
const fs = require('fs');
const { supabase, isConfigured } = require('../config/supabase');

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'resumes';

/**
 * Ensures that the bucket exists in Supabase.
 * If not, attempts to create it as a public bucket.
 */
const ensureSupabaseBucket = async () => {
  if (!supabase) return false;
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn('[Storage] Warning listing buckets in Supabase:', error.message);
      return false;
    }
    const exists = buckets && buckets.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      });
      if (createError) {
        console.warn('[Storage] Notice creating Supabase bucket:', createError.message);
      } else {
        console.log(`[Storage] Created Supabase storage bucket '${BUCKET_NAME}'`);
      }
    }
    return true;
  } catch (err) {
    console.warn('[Storage] Supabase bucket check error:', err.message);
    return false;
  }
};

/**
 * Upload resume buffer to Supabase Storage (with fallback to local disk).
 */
const uploadResume = async (file, userId) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const safeOriginalName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `resume_${userId || 'student'}_${Date.now()}_${safeOriginalName}${ext}`;

  // 1. Attempt upload to Supabase Storage
  if (isConfigured && supabase) {
    try {
      await ensureSupabaseBucket();

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(uniqueName, file.buffer, {
          contentType: file.mimetype || 'application/octet-stream',
          upsert: true
        });

      if (error) {
        console.error('[Storage] Supabase upload failed, falling back to local disk:', error.message);
        throw error;
      }

      // Retrieve public URL from Supabase
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uniqueName);

      const publicUrl = urlData?.publicUrl;
      console.log('[Storage] File successfully stored in Supabase Storage:', publicUrl);

      return {
        resume_url: publicUrl,
        storage_type: 'supabase',
        filename: uniqueName
      };
    } catch (supabaseError) {
      console.warn('[Storage] Supabase storage exception, using local disk fallback:', supabaseError.message);
    }
  }

  // 2. Fallback to Local Disk Storage
  const localDir = path.join(__dirname, '../../uploads/resumes');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  const localFilePath = path.join(localDir, uniqueName);
  fs.writeFileSync(localFilePath, file.buffer);
  console.log('[Storage] File stored on local disk:', localFilePath);

  return {
    resume_url: `/uploads/resumes/${uniqueName}`,
    storage_type: 'local',
    filename: uniqueName
  };
};

module.exports = {
  uploadResume,
  ensureSupabaseBucket
};
