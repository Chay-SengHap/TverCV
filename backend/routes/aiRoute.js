import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { enhanceJobDescription, enhanceProfessionalSumary, uploadResume } from '../controllers/aiController.js'
import { upload } from "../config/multer.js";

export const aiRouter = express.Router()

aiRouter.post('/enchance-pro-sum' , protect , enhanceProfessionalSumary  )
aiRouter.post('/enhance-job-desc' , protect , enhanceJobDescription)
aiRouter.post('/upload-resume' , protect, upload.single('resume') , uploadResume)