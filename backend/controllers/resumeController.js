
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
        const userId = req.userId; // user_id from auth token
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        // 1. CRITICAL FIX: Parse the string into an object FIRST before you read or modify it!
        let resumeDataCopy = JSON.parse(resumeData);

        // 2. Handle image upload if a file exists
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
            
            // Clean up the temporary file from your local disk
            fs.unlinkSync(image.path);

            // Assign the uploaded URL directly to the personal_info block
            if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
            resumeDataCopy.personal_info.image_url = response.url;
        }

        // 3. Update the main Resume table
        const [affectedRows] = await Resume.update(
            {
                title: resumeDataCopy.title,
                is_public: resumeDataCopy.is_public,
                public_slug: resumeDataCopy.public_slug,
                template: resumeDataCopy.template,
                accent_color: resumeDataCopy.accent_color,
                professional_summary: resumeDataCopy.professional_summary,
                updated_at: new Date() // Manual update since timestamps: false
            },
            {
                where: {
                    id: resumeId,
                    user_id: userId // Your model uses snake_case 'user_id'
                }
            }
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                message: "Resume not found or you are not authorized to update it"
            });
        }

        // 4. Update the Personal Info table if personal info data was sent
        if (resumeDataCopy.personal_info) {
            await PersonalInfo.update(
                {
                    full_name: resumeDataCopy.personal_info.full_name,
                    profession: resumeDataCopy.personal_info.profession,
                    email: resumeDataCopy.personal_info.email,
                    phone: resumeDataCopy.personal_info.phone,
                    location: resumeDataCopy.personal_info.location,
                    linkedin: resumeDataCopy.personal_info.linkedin,
                    website: resumeDataCopy.personal_info.website,
                    image_url: resumeDataCopy.personal_info.image_url // Updated from imagekit above
                },
                {
                    where: { resume_id: resumeId }
                }
            );
        }

        // 5. Re-fetch the updated resume WITH its personal info included
        const updatedResume = await Resume.findOne({
            where: { id: resumeId, user_id: userId },
            include: [{
                model: PersonalInfo,
                as: 'personal_info' // Must match the 'as' alias in your model relationship declaration
            }]
        });

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