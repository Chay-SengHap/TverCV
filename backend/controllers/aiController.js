import { Resume, PersonalInfo, Experience, Education, Project, Skill } from "../model/Relationship.js"
import ai from "../config/ai.js";
import 'dotenv/config';
import fs from 'fs';
import { imageKit } from "../config/imageKit.js";
import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib';

async function extractFirstJpegFromPdf(pdfBuffer) {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
        
        for (const [ref, obj] of indirectObjects) {
            if (obj instanceof PDFRawStream) {
                const dict = obj.dict;
                const subtype = dict.get(PDFName.of('Subtype'));
                if (subtype instanceof PDFName && subtype.toString() === '/Image') {
                    const filter = dict.get(PDFName.of('Filter'));
                    let isJpeg = false;
                    if (filter instanceof PDFName) {
                        const filterStr = filter.toString();
                        if (filterStr === '/DCTDecode' || filterStr === '/DCT' || filterStr === '/JPXDecode') {
                            isJpeg = true;
                        }
                    } else if (Array.isArray(filter)) {
                        isJpeg = filter.some(f => f instanceof PDFName && (f.toString() === '/DCTDecode' || f.toString() === '/DCT' || f.toString() === '/JPXDecode'));
                    }

                    if (isJpeg) {
                        const bytes = obj.contents;
                        if (bytes) {
                            return Buffer.from(bytes);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error extracting JPEG from PDF using pdf-lib:", e);
    }
    return null;
}

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
            system_instruction: "You are an expert in resume writing. Your task is to enhance the job description of a resume. Make it compelling and ATS-friendly.",
            input: userContent,
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
        const file = req.file;

        if (!file && (!resumeText || resumeText.trim() === "")) {
            return res.status(400).json({ message: "No resume file uploaded or text provided." });
        }

        const systemPrompt = "You are an expert AI Agent to extract data from a resume. Analyze the text/document and populate the fields precisely following the provided JSON structural schema template.";
        
        const userPrompt = `extract data from this resume.
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

        let contents = [];
        let pdfBuffer = null;
        if (file) {
            pdfBuffer = fs.readFileSync(file.path);
            contents.push({
                inlineData: {
                    data: pdfBuffer.toString("base64"),
                    mimeType: "application/pdf"
                }
            });
            contents.push(userPrompt);
        } else {
            contents.push(`extract data from this resume : ${resumeText}\n\n${userPrompt}`);
        }

        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL || "gemini-3.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        // Clean up temp file
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        let extractedData = response.text.trim();
        // Remove markdown block if present
        if (extractedData.startsWith("```")) {
            extractedData = extractedData.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        }

        let parsedData;
        try {
            parsedData = JSON.parse(extractedData);
            if (typeof parsedData === "string") {
                parsedData = JSON.parse(parsedData);
            }
        } catch (parseError) {
            console.error("Failed to parse AI response:", extractedData, parseError);
            return res.status(400).json({ message: "Unable to parse resume details returned by AI. Please try again." });
        }

        const newResume = await Resume.create({
            user_id: userId,
            title: title || "Untitled Resume",
            professional_summary: parsedData.professional_summary || "",
            is_public: false
        });

        // Attempt to extract profile image from PDF
        let imageKitUrl = "";
        if (pdfBuffer) {
            const extractedImageBuffer = await extractFirstJpegFromPdf(pdfBuffer);
            if (extractedImageBuffer) {
                try {
                    const uploadResponse = await imageKit.files.upload({
                        file: extractedImageBuffer.toString("base64"),
                        fileName: `resume-${newResume.id}.jpg`,
                        folder: "user-resume"
                    });
                    imageKitUrl = uploadResponse.url;
                } catch (uploadErr) {
                    console.error("Failed to upload extracted image to ImageKit:", uploadErr);
                }
            }
        }

        let finalImageUrl = "";
        if (imageKitUrl && (imageKitUrl.startsWith("http://") || imageKitUrl.startsWith("https://"))) {
            finalImageUrl = imageKitUrl;
        } else if (parsedData.personal_info && parsedData.personal_info.image && (parsedData.personal_info.image.startsWith("http://") || parsedData.personal_info.image.startsWith("https://"))) {
            finalImageUrl = parsedData.personal_info.image;
        }

        if (parsedData.personal_info) {
            await PersonalInfo.create({
                resume_id: newResume.id,
                image_url: finalImageUrl,
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
            const experiencesData = parsedData.experiences.map((exp, index) => {
                const titleStr = exp.job_title || exp.position || "";
                return {
                    resume_id: newResume.id,
                    position: titleStr,
                    company: exp.company || "",
                    job_title: titleStr,
                    start_date: exp.start_date || "",
                    end_date: exp.end_date || "",
                    is_current: exp.is_current || false,
                    description: exp.description || ""
                };
            });
            await Experience.bulkCreate(experiencesData);
        }

        if (Array.isArray(parsedData.educations)) {
            const educationsData = parsedData.educations.map((edu, index) => {
                let pos = parseInt(edu.position, 10);
                if (isNaN(pos)) pos = index;
                return {
                    resume_id: newResume.id,
                    position: pos,
                    institution: edu.institution || "",
                    degree: edu.degree || "",
                    field: edu.field || "",
                    graduation_date: edu.graduation_date || "",
                    gpa: edu.gpa || ""
                };
            });
            await Education.bulkCreate(educationsData);
        }

        if (Array.isArray(parsedData.projects)) {
            const projectsData = parsedData.projects.map((proj, index) => {
                let pos = parseInt(proj.position, 10);
                if (isNaN(pos)) pos = index;
                return {
                    resume_id: newResume.id,
                    position: pos,
                    name: proj.name || "",
                    type: proj.type || "",
                    description: proj.description || ""
                };
            });
            await Project.bulkCreate(projectsData);
        }

        if (Array.isArray(parsedData.skills)) {
            const skillsData = parsedData.skills.map((skill) => ({
                resume_id: newResume.id,
                skill_name: typeof skill === 'string' ? skill : (skill.skill_name || ""),
                proficiency: (skill && skill.proficiency) || "intermediate"
            }));
            await Skill.bulkCreate(skillsData);
        }

        return res.status(200).json({ resumeId: newResume.id });

    } catch (error) {
        console.error("uploadResume Error:", error);
        return res.status(500).json({ message: error.message || "Failed to process and upload resume." });
    }
};