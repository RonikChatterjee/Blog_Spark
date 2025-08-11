import express from 'express'

const router = express.Router()

// Importing Middleware
import {
  validateLoginData,
  validateSignupData,
} from '../middlewares/validateBackend.js'
import {
  requireGuest,
  requireAuth,
} from '../middlewares/authentication.js'

// Importing Controllers
import {
  handleGetUserSignUp,
  handleGetUserLogIn,
  handlePostUserSignUp,
  handlePostUserLogIn,
  handlePostUserLogout,
} from '../controllers/userController.js'
import {
  handleGetUserProfile,
  handleUpdateUserProfile,
} from '../controllers/userProfileController.js'

router
  .route('/signup')
  .get(requireGuest, handleGetUserSignUp)
  .post(requireGuest, validateSignupData, handlePostUserSignUp)

router
  .route('/login')
  .get(requireGuest, handleGetUserLogIn)
  .post(requireGuest, validateLoginData, handlePostUserLogIn)

router.route('/logout').post(requireAuth, handlePostUserLogout)

router
  .route('/profile')
  .get(requireAuth, handleGetUserProfile)
  .patch(requireAuth, handleUpdateUserProfile)

export default router
