
import { Json } from "sequelize/lib/utils"
import { Resume } from "../model/Resume.js"
import { imageKit } from "../config/imageKit.js"
import fs from 'fs'
import {PersonalInfo} from "../model/Personal_info.js"

// controller for creating new resume
// Post : /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from your working protect middleware
        const { title } = req.body;

        // FIXED: Map JavaScript's userId directly to your model's user_id column
        const newResume = await Resume.create({
            user_id: userId, 
            title
        });

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
export const deleteResume = async (req, res)=>{
    try {
        const userId = req.userId
        const { resumeId } = req.params

        const deletedRows = await Resume.destroy({
            where : {
                id : resumeId,
                user_id : userId
            }
        })

        if (deletedRows === 0) {
            return res.status(404).json({
                message: "Resume not found or you are not authorized to delete it"
            })
        }

        return res.status(200).json({
            message : "Resume deleted successfully"
        })

    } catch (error) {
         return res.status(400).json({
            message : error.message
        })
    }
}

// get resume by id
// Get : /api/resumes/get

export const getResumeById = async (req, res)=>{
    try {
        const userId = req.userId
        const { resumeId } = req.params

        const resume = await Resume.findOne({
            where :{
                id : resumeId,
                user_id : userId
            }
        })
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found or you are not authorized to view it"
            });
        }
        return res.status(200).json({
            message: "Resume fetched successfully",
            data: resume
        });

    } catch (error) {
         return res.status(400).json({
            message : error.message
        })
    }
}

// get resume by id public
// Get : /api/resumes/public

export const getPublicResumeById = async (req, res)=>{
    try {
        
        const { resumeId } = req.params

        const resume = await Resume.findOne({
            where :{
                id : resumeId,
                is_public : true
            }
        })
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
            message : error.message
        })
    }
}

// controller for updating a resume
// Put : /api/resume/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData);
        } else {
            resumeDataCopy = resumeData || {};
        }

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
            
            fs.unlinkSync(image.path);

            if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
            resumeDataCopy.personal_info.image_url = response.url;
        }

        // 🛟 FIX: Build a clean update object containing ONLY defined values
        const updateFields = {};
        if (resumeDataCopy.title !== undefined) updateFields.title = resumeDataCopy.title;
        if (resumeDataCopy.is_public !== undefined) updateFields.is_public = resumeDataCopy.is_public;
        if (resumeDataCopy.public_slug !== undefined) updateFields.public_slug = resumeDataCopy.public_slug;
        if (resumeDataCopy.template !== undefined) updateFields.template = resumeDataCopy.template;
        if (resumeDataCopy.accent_color !== undefined) updateFields.accent_color = resumeDataCopy.accent_color;
        if (resumeDataCopy.professional_summary !== undefined) updateFields.professional_summary = resumeDataCopy.professional_summary;
        
        // Always update the timestamp
        updateFields.updated_at = new Date();

        // 3. Update the main Resume table using only the explicit changes
        const [affectedRows] = await Resume.update(
            updateFields, // No more passing undefined/null properties blindly!
            {
                where: {
                    id: resumeId,
                    user_id: userId 
                }
            }
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: "Resume not found or you are not authorized to update it"
            });
        }

        // 4. Update the Personal Info table safely if it was explicitly sent
        if (resumeDataCopy.personal_info) {
            const personalInfoFields = {};
            const pi = resumeDataCopy.personal_info;
            
            if (pi.full_name !== undefined) personalInfoFields.full_name = pi.full_name;
            if (pi.profession !== undefined) personalInfoFields.profession = pi.profession;
            if (pi.email !== undefined) personalInfoFields.email = pi.email;
            if (pi.phone !== undefined) personalInfoFields.phone = pi.phone;
            if (pi.location !== undefined) personalInfoFields.location = pi.location;
            if (pi.linkedin !== undefined) personalInfoFields.linkedin = pi.linkedin;
            if (pi.website !== undefined) personalInfoFields.website = pi.website;
            if (pi.image_url !== undefined) personalInfoFields.image_url = pi.image_url;

            await PersonalInfo.update(
                personalInfoFields,
                {
                    where: { resume_id: resumeId }
                }
            );
        }

        // 5. Re-fetch the updated resume
        const updatedResume = await Resume.findOne({
            where: { id: resumeId, user_id: userId },
            include: [{
                model: PersonalInfo,
                as: 'personal_info' 
            }]
        });

        return res.status(200).json({
            message: 'Saved successfully',
            resume: updatedResume
        });

    } catch (error) {
        console.error("Error updating resume:", error);
        return res.status(500).json({
            message: "An internal server error occurred",
            error: error.message // This tells us the exact error if it continues failing
        });
    }
};