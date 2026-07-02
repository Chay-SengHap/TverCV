
import { Resume } from "../model/Resume.js"
import { PersonalInfo } from "../model/Personal_info.js"

// Create a new resume
export async function createResume(userId, title) {
  try {
    const newResume = await Resume.create({
      user_id: userId,
      title
    });
    return newResume;
  } catch (error) {
    console.error("Repository error creating resume:", error);
    throw error;
  }
}

// Delete a resume (scoped to the owning user)
export async function deleteResume(resumeId, userId) {
  try {
    const deletedRows = await Resume.destroy({
      where: {
        id: resumeId,
        user_id: userId
      }
    });
    return deletedRows;
  } catch (error) {
    console.error("Repository error deleting resume:", error);
    throw error;
  }
}

// Get a resume by id, scoped to the owning user
export async function getResumeById(resumeId, userId) {
  try {
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: userId
      }
    });
    return resume;
  } catch (error) {
    console.error("Repository error fetching resume:", error);
    throw error;
  }
}

// Get a resume by id, only if it's public (no user scoping)
export async function getPublicResumeById(resumeId) {
  try {
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        is_public: true
      }
    });
    return resume;
  } catch (error) {
    console.error("Repository error fetching public resume:", error);
    throw error;
  }
}

// Update the core Resume table fields
export async function updateResumeFields(resumeId, userId, resumeFields) {
  try {
    const {
      title,
      is_public,
      public_slug,
      template,
      accent_color,
      professional_summary
    } = resumeFields;

    const [affectedRows] = await Resume.update(
      {
        title,
        is_public,
        public_slug,
        template,
        accent_color,
        professional_summary,
        updated_at: new Date() // Manual update since timestamps: false
      },
      {
        where: {
          id: resumeId,
          user_id: userId
        }
      }
    );

    return affectedRows;
  } catch (error) {
    console.error("Repository error updating resume fields:", error);
    throw error;
  }
}

// Update the PersonalInfo table linked to a resume
export async function updatePersonalInfo(resumeId, personalInfoFields) {
  try {
    const {
      full_name,
      profession,
      email,
      phone,
      location,
      linkedin,
      website,
      image_url
    } = personalInfoFields;

    const [affectedRows] = await PersonalInfo.update(
      {
        full_name,
        profession,
        email,
        phone,
        location,
        linkedin,
        website,
        image_url
      },
      {
        where: { resume_id: resumeId }
      }
    );

    return affectedRows;
  } catch (error) {
    console.error("Repository error updating personal info:", error);
    throw error;
  }
}

// Fetch a resume with its personal info included (used after update)
export async function getResumeWithPersonalInfo(resumeId, userId) {
  try {
    const resume = await Resume.findOne({
      where: { id: resumeId, user_id: userId },
      include: [{
        model: PersonalInfo,
        as: 'personal_info' // Must match the 'as' alias in your model relationship
      }]
    });
    return resume;
  } catch (error) {
    console.error("Repository error fetching resume with personal info:", error);
    throw error;
  }
}