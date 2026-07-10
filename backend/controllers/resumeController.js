
import { Json } from "sequelize/lib/utils"
import { Resume } from "../model/Resume.js"
import { imageKit } from "../config/imageKit.js"
import fs from 'fs'
import {PersonalInfo} from "../model/Personal_info.js"
import * as resumeRepository from "../repositories/sqlResumeRepository.js";
import { sequelize } from "../db/database.js"

// Post : /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from your working protect middleware
    const { title } = req.body;

    const newResume = await resumeRepository.createResume(userId, title);

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// Delete : /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deletedRows = await resumeRepository.deleteResume(resumeId, userId);

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to delete it"
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully"
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// Get : /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await resumeRepository.getResumeById(resumeId, userId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to view it"
      });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      resume: resume // Sending it explicitly as 'resume' to match frontend needs
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// Get : /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await resumeRepository.getPublicResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to view it"
      });
    }

    return res.status(200).json({
      message: "Resume is Public successfully",
      data: resume
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// Put : /api/resume/update
export const updateResume = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    const data = typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData;

    // Normalization fallback block: ensures both 'public' and 'is_public' routes work safely
    if (data.public !== undefined) {
      data.is_public = data.public;
    }

    if (image) {
      const stream = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: stream,
        fileName: `resume-${resumeId}.jpg`,
        folder: "user-resume",
        transformation: {
          pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : ""),
        },
      });

      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      if (!data.personal_info) data.personal_info = {};
      data.personal_info.image_url = response.url;
    }

    await resumeRepository.updateResumeFields(resumeId, userId, data, { transaction });

    if (data.personal_info) {
      await resumeRepository.upsertPersonalInfo(resumeId, data.personal_info, { transaction });
    }

    if (data.experience) {
      await resumeRepository.replaceExperiences(resumeId, data.experience, { transaction });
    }

    if (data.education) {
      await resumeRepository.replaceEducation(resumeId, data.education, { transaction });
    }

    if (data.project) {
      await resumeRepository.replaceProjects(resumeId, data.project, { transaction });
    }

    if (data.skills) {
      await resumeRepository.replaceSkills(resumeId, data.skills, { transaction });
    }

    await transaction.commit();

    const updatedResume = await resumeRepository.getResumeById(resumeId, userId);

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};