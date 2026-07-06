// Controller for enhancing a resume's professional summary
import { Resume, PersonalInfo, Experience, Education, Project, Skill } from "../model/Relationship.js"
import ai from "../config/ai.js";
import 'dotenv/config';

// Post /api/enhance-pro-sum
export const enhanceProfessionalSumary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }
        
        const interaction = await ai.interactions.create({
            model: process.env.AI_MODEL || "gemini-3.5-flash",
            system_instruction: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
            input: userContent,
        });

        const enhanceContent = interaction.output_text;

        return res.status(200).json({
            success: true,
            output: enhanceContent
        });

    } catch (error) {
        console.error("AI Summary Enhancement Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred"
        });
    }
}

// Post : /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }
        
        const interaction = await ai.interactions.create({
            model: process.env.AI_MODEL || "gemini-3.5-flash",
            system_instruction: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
            input: userContent
        });

        const enhanceContent = interaction.output_text;

        return res.status(200).json({
            success: true,
            output: enhanceContent
        });

    } catch (error) {
        console.error("AI Job Description Enhancement Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred"
        });
    }
}

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ message: "Server received empty resume text. Unable to parse." });
        }

        const systemPrompt = "You are an expert AI Agent to extract data from a resume. Analyze the text and populate the fields precisely following the provided JSON structural schema template.";
        
        const userPrompt = `extract data from this resume : ${resumeText}
        Provide data in the following JSON format with no additional text before or after :
        {
            "professional_summary": "",
            "personal_info": {
                "image": "",
                "full_name": "",
                "profession": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": ""
            },
            "experiences": [
                {
                    "position": 0,
                    "company": "",
                    "job_title": "",
                    "start_date": "",
                    "end_date": "",
                    "is_current": false,
                    "description": ""
                }
            ],
            "educations": [
                {
                    "position": 0,
                    "institution": "",
                    "degree": "",
                    "field": "",
                    "graduation_date": "",
                    "gpa": ""
                }
            ],
            "projects": [
                {
                    "position": 0,
                    "name": "",
                    "type": "",
                    "description": ""
                }
            ],
            "skills": [
                {
                    "skill_name": "",
                    "proficiency": ""
                }
            ]
        }`;

        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL || "gemini-3.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        const extractedData = response.text;
        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({
            user_id: userId,
            title: title || "Untitled Resume",
            professional_summary: parsedData.professional_summary || "",
            is_public: false
        });

        if (parsedData.personal_info) {
            await PersonalInfo.create({
                resume_id: newResume.id,
                image_url: parsedData.personal_info.image || "",
                full_name: parsedData.personal_info.full_name || "",
                profession: parsedData.personal_info.profession || "",
                email: parsedData.personal_info.email || "",
                phone: parsedData.personal_info.phone || "",
                location: parsedData.personal_info.location || "",
                linkedin: parsedData.personal_info.linkedin || "",
                website: parsedData.personal_info.website || ""
            });
        }

        if (Array.isArray(parsedData.experiences)) {
            const experiencesData = parsedData.experiences.map((exp, index) => ({
                resume_id: newResume.id,
                position: exp.position || index,
                company: exp.company || "",
                job_title: exp.job_title || "",
                start_date: exp.start_date || "",
                end_date: exp.end_date || "",
                is_current: exp.is_current || false,
                description: exp.description || ""
            }));
            await Experience.bulkCreate(experiencesData);
        }

        if (Array.isArray(parsedData.educations)) {
            const educationsData = parsedData.educations.map((edu, index) => ({
                resume_id: newResume.id,
                position: edu.position || index,
                institution: edu.institution || "",
                degree: edu.degree || "",
                field: edu.field || "",
                graduation_date: edu.graduation_date || "",
                gpa: edu.gpa || ""
            }));
            await Education.bulkCreate(educationsData);
        }

        if (Array.isArray(parsedData.projects)) {
            const projectsData = parsedData.projects.map((proj, index) => ({
                resume_id: newResume.id,
                position: proj.position || index,
                name: proj.name || "",
                type: proj.type || "",
                description: proj.description || ""
            }));
            await Project.bulkCreate(projectsData);
        }

        if (Array.isArray(parsedData.skills)) {
            const skillsData = parsedData.skills.map((skill) => ({
                resume_id: newResume.id,
                skill_name: skill.skill_name || "",
                proficiency: skill.proficiency || "intermediate"
            }));
            await Skill.bulkCreate(skillsData);
        }

        return res.status(200).json({ resumeId: newResume.id });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};