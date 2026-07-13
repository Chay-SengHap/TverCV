import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createResume, deleteResume, duplicateResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import { upload } from "../config/multer.js";

export const resumeRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resume management APIs
 */

/**
 * @swagger
 * /api/resumes/create:
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resume created successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
resumeRouter.post('/create' , protect, createResume )

/**
 * @swagger
 * /api/resumes/duplicate/{resumeId}:
 *   post:
 *     summary: Duplicate an existing resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resume to duplicate
 *     responses:
 *       201:
 *         description: Resume duplicated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resume not found.
 *       500:
 *         description: Server error.
 */
resumeRouter.post('/duplicate/:resumeId' , protect, duplicateResume )

/**
 * @swagger
 * /api/resumes/update:
 *   put:
 *     summary: Update an existing resume (handles optional image upload)
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               data:
 *                 type: string
 *                 description: JSON stringified resume data
 *     responses:
 *       200:
 *         description: Resume updated successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
resumeRouter.put('/update' ,upload.single('image') , protect, updateResume )

/**
 * @swagger
 * /api/resumes/delete/{resumeId}:
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resume to delete
 *     responses:
 *       200:
 *         description: Resume deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resume not found.
 *       500:
 *         description: Server error.
 */
resumeRouter.delete('/delete/:resumeId' , protect, deleteResume )

/**
 * @swagger
 * /api/resumes/get/{resumeId}:
 *   get:
 *     summary: Get a resume by ID (Private route)
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resume to retrieve
 *     responses:
 *       200:
 *         description: Resume details.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Resume not found.
 *       500:
 *         description: Server error.
 */
resumeRouter.get('/get/:resumeId' , protect, getResumeById )

/**
 * @swagger
 * /api/resumes/public/{resumeId}:
 *   get:
 *     summary: Get a public resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the resume to retrieve
 *     responses:
 *       200:
 *         description: Resume details.
 *       404:
 *         description: Resume not found.
 *       500:
 *         description: Server error.
 */
resumeRouter.get('/public/:resumeId' ,getPublicResumeById)
