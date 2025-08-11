import express from 'express'

const router = express.Router()

// Importing Middleware
import { authOptional } from '../middlewares/authentication.js'

// Importing the home controller
import { handleGetHomePage } from '../controllers/homeController.js'

// Home route
router.route('/').get(authOptional, handleGetHomePage)

export default router
