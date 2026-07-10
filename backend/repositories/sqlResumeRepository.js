import { Resume, PersonalInfo, Experience, Education, Project, Skill } from "../model/Relationship.js"

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

export const getResumeById = async (resumeId, userId) => {
    try {
        const resume = await Resume.findOne({
            where: { 
                id: resumeId,
                user_id: userId 
            },
            include: [
                { model: PersonalInfo, as: "personal_info" },
                { model: Experience, as: "experiences" },
                { model: Education, as: "education" },
                { model: Project, as: "projects" },
                { model: Skill, as: "skills" }
            ]
        });
        return resume;
    } catch (error) {
        throw new Error("Database query failed: " + error.message);
    }
};

export async function getPublicResumeById(resumeId) {
  try {
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        is_public: true
      },
      include: [
        { model: PersonalInfo, as: "personal_info" },
        { model: Experience, as: "experiences" },
        { model: Education, as: "education" },
        { model: Project, as: "projects" },
        { model: Skill, as: "skills" }
      ]
    });
    return resume;
  } catch (error) {
    console.error("Repository error fetching public resume:", error);
    throw error;
  }
}

export async function updateResumeFields(resumeId, userId, resumeFields, options = {}) {
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
        updated_at: new Date()
      },
      {
        where: {
          id: resumeId,
          user_id: userId
        },
        transaction: options.transaction
      }
    );

    return affectedRows;
  } catch (error) {
    console.error("Repository error updating resume fields:", error);
    throw error;
  }
}

export async function upsertPersonalInfo(resumeId, personalInfoFields, options = {}) {
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

    const existingInfo = await PersonalInfo.findOne({
      where: { resume_id: resumeId },
      transaction: options.transaction
    });

    if (existingInfo) {
      return await PersonalInfo.update(
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
          where: { resume_id: resumeId },
          transaction: options.transaction
        }
      );
    } else {
      return await PersonalInfo.create(
        {
          resume_id: resumeId,
          full_name,
          profession,
          email,
          phone,
          location,
          linkedin,
          website,
          image_url
        },
        { transaction: options.transaction }
      );
    }
  } catch (error) {
    console.error("Repository error saving personal info:", error);
    throw error;
  }
}

export async function replaceExperiences(resumeId, experiences, options = {}) {
  try {
    await Experience.destroy({
      where: { resume_id: resumeId },
      transaction: options.transaction
    });

    if (experiences && experiences.length > 0) {
      const formatted = experiences.map(exp => ({
        resume_id: resumeId,
        position: exp.position || exp.job_title,
        company: exp.company,
        job_title: exp.job_title || exp.position,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current ? 1 : 0,
        description: exp.description
      }));

      await Experience.bulkCreate(formatted, { transaction: options.transaction });
    }
  } catch (error) {
    console.error("Repository error sync list experiences:", error);
    throw error;
  }
}

export async function replaceEducation(resumeId, educations, options = {}) {
  try {
    await Education.destroy({
      where: { resume_id: resumeId },
      transaction: options.transaction
    });

    if (educations && educations.length > 0) {
      const formatted = educations.map(edu => ({
        resume_id: resumeId,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        graduation_date: edu.graduation_date,
        gpa: edu.gpa
      }));

      await Education.bulkCreate(formatted, { transaction: options.transaction });
    }
  } catch (error) {
    console.error("Repository error sync list education:", error);
    throw error;
  }
}

export async function replaceProjects(resumeId, projects, options = {}) {
  try {
    await Project.destroy({
      where: { resume_id: resumeId },
      transaction: options.transaction
    });

    if (projects && projects.length > 0) {
      const formatted = projects.map(proj => ({
        resume_id: resumeId,
        name: proj.name,
        type: proj.type,
        description: proj.description
      }));

      await Project.bulkCreate(formatted, { transaction: options.transaction });
    }
  } catch (error) {
    console.error("Repository error sync list projects:", error);
    throw error;
  }
}

export async function replaceSkills(resumeId, skills, options = {}) {
  try {
    await Skill.destroy({
      where: { resume_id: resumeId },
      transaction: options.transaction
    });

    if (skills && skills.length > 0) {
      const formatted = skills.map(sk => ({
        resume_id: resumeId,
        skill_name: sk.skill_name,
        proficiency: sk.proficiency
      }));

      await Skill.bulkCreate(formatted, { transaction: options.transaction });
    }
  } catch (error) {
    console.error("Repository error sync list skills:", error);
    throw error;
  }
}