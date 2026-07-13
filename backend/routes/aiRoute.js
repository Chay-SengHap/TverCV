import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { enhanceJobDescription, enhanceProfessionalSumary, uploadResume } from '../controllers/aiController.js'
import { upload } from "../config/multer.js";

export const aiRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI assistance endpoints
 */

/**
 * @swagger
 * /api/ai/enchance-pro-sum:
 *   post:
 *     summary: Enhance professional summary using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Professional summary enhanced successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
aiRouter.post('/enchance-pro-sum' , protect , enhanceProfessionalSumary  )

/**
 * @swagger
 * /api/ai/enhance-job-desc:
 *   post:
 *     summary: Enhance job description using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job description enhanced successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
aiRouter.post('/enhance-job-desc' , protect , enhanceJobDescription)

/**
 * @swagger
 * /api/ai/upload-resume:
 *   post:
 *     summary: Upload and parse resume data using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded and parsed successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
aiRouter.post('/upload-resume' , protect, upload.single('resume') , uploadResume)