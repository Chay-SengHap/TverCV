
import { Json } from "sequelize/lib/utils"
import { Resume } from "../model/Resume.js"
import { imageKit } from "../config/imageKit.js"
import fs from 'fs'
import {PersonalInfo} from "../model/Personal_info.js"
import * as resumeRepository from "../repositories/sqlResumeRepository.js";


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
  try {
    const userId = req.userId; // user_id from auth token
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    // 1. Parse the string into an object first
    let resumeDataCopy = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
    // 2. Handle image upload if a file exists (external service call, not DB — stays here)
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: `resume-${resumeId}.jpg`,
        folder: 'user-resume',
        transformation: {
          pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
        }
      });

      // Clean up the temporary file from local disk
      fs.unlinkSync(image.path);

      if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
      resumeDataCopy.personal_info.image_url = response.url;
    }

    // 3. Update the main Resume table
    const affectedRows = await resumeRepository.updateResumeFields(
      resumeId,
      userId,
      resumeDataCopy
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Resume not found or you are not authorized to update it"
      });
    }

    // 4. Update the Personal Info table if personal info data was sent
    if (resumeDataCopy.personal_info) {
      await resumeRepository.updatePersonalInfo(resumeId, resumeDataCopy.personal_info);
    }

    // 5. Re-fetch the updated resume WITH its personal info included
    const updatedResume = await resumeRepository.getResumeWithPersonalInfo(resumeId, userId);

    return res.status(200).json({
      message: 'Saved successfully',
      resume: updatedResume
    });

  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(500).json({
      message: "An internal server error occurred"
    });
  }
};