import express from 'express'

const router = express.Router()

// Importing Middleware
import {
  authOptional,
  checkEmailVerificationStatus,
} from '../middlewares/authentication.middleware.js'

// Importing the home controller
import { handleGetHomePage } from '../controllers/home.controller.js'

// Home route
router
  .route('/')
  .get(authOptional, checkEmailVerificationStatus, handleGetHomePage)

export default router
