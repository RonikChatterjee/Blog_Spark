import express from 'express'

const router = express.Router()

// Importing Middleware
import {
  validateLoginData,
  validateSignupData,
  validateUserBio,
  validateUsername,
  validateUserGender,
  validateUserContact,
  validateUserEmail,
  validateUserPassword,
} from '../middlewares/validate.middleware.js'
import {
  requireGuest,
  requireAuth,
} from '../middlewares/authentication.middleware.js'
import {
  autoCleanupUploadsDir,
  uploadAvatarImage,
  uploadCoverImage,
  handleMulterError,
} from '../middlewares/multer.middleware.js'

// Importing Controllers
import {
  handleGetUserSignUp,
  handleGetUserLogIn,
  handlePostUserSignUp,
  handlePostUserLogIn,
  handlePostForgotPassword,
  handlePostUserLogout,
} from '../controllers/user.controller.js'
import {
  handleGetUserProfile,
  handleUpdateCoverImage,
  handleUpdateAvatar,
  handleUpdateUserName,
  handleUpdateBio,
  handleUpdateGender,
  handleUpdateContact,
  handleUpdateEmail,
  handleVerifyEmail,
  handleUpdatePassword,
} from '../controllers/userProfile.controller.js'

router
  .route('/signup')

  /**
   * @route GET /users/signup
   * @access Public (guest users only)
   * @middleware requireGuest
   * @description Get the user signup page
   * @returns {Object} Renders the user signup page
   * @controller handleGetUserSignUp
   */
  .get(requireGuest, handleGetUserSignUp)

  /**
   * @route POST /users/signup
   * @access Public (guest users only)
   * @middleware requireGuest, validateSignupData
   * @description Register a new user.
   * @body {string} firstname - Firstname (required, 2-25 characters)
   * @body {string} lastname - Lastname (required, 2-25 characters)
   * @body {string} gender - Gender (required, [male, female, other])
   * @body {string} contact - Unique contact number (required, 10-15 digits)
   * @body {string} email - Unique email address (required, max: 254 characters)
   * @body {string} password - Strong password (required, min: 8 characters)
   * @returns {Object} Created user object with tokens
   * @controller handlePostUserSignUp
   */
  .post(requireGuest, validateSignupData, handlePostUserSignUp)

router
  .route('/login')

  /**
   * @route GET /users/login
   * @access Public (guest users only)
   * @middleware requireGuest
   * @description Get the user login page
   * @returns {Object} Renders the user login page
   * @controller handleGetUserLogIn
   */
  .get(requireGuest, handleGetUserLogIn)

  /**
   * @route POST /users/login
   * @access Public (guest users only)
   * @middleware requireGuest, validateLoginData
   * @description Log in an existing user
   * @body {string} email - Unique email address (required)
   * @body {string} password - Strong password (required, min: 8 characters)
   * @returns {Object} Created jwt tokens & add them to the user cookies
   * @controller handlePostUserLogIn
   */
  .post(requireGuest, validateLoginData, handlePostUserLogIn)

router
  .route('/forgot-password')

  /**
   * @route POST /users/forgot-password
   * @access Public (guest users only)
   * @middleware requireGuest
   * @description Send a password reset link to the user's email
   * @body {string} email - Unique email address (required)
   * @returns {Object} Success or error message
   * @controller handlePostForgotPassword
   */
  .post(requireGuest, handlePostForgotPassword)

router
  .route('/logout')

  /**
   * @route POST /users/logout
   * @access Private (authenticated users only)
   * @middleware requireAuth
   * @description Log out the current user
   * @returns {Object} Success or error message
   * @controller handlePostUserLogout
   */
  .post(requireAuth, handlePostUserLogout)

router
  .route('/profile')

  /**
   * @route GET /users/profile
   * @access Public (authenticated users only)
   * @middleware requireAuth
   * @description Get the user profile page
   * @returns {Object} Renders the user profile page
   * @controller handleGetUserProfile
   */
  .get(requireAuth, handleGetUserProfile)

router
  .route('/profile/cover-image')

  /**
   * @route PATCH /users/profile/cover-image
   * @access Private (authenticated users only)
   * @middleware requireAuth, uploadCoverPicture.single('coverImage'), handleMulterError, autoCleanupUploadsDir
   * @description Update the user's cover image to Cloudinary and save the secure URL in the database.
   * @file {File} coverImage - Cover image file (required, size: <= 10MB(max), types: [image/jpeg, image/png])
   * @returns {Object} Success or error message
   * @controller handleUpdateCoverImage
   */
  .patch(
    requireAuth,
    uploadCoverImage.single('coverImage'),
    handleMulterError,
    autoCleanupUploadsDir,
    handleUpdateCoverImage
  )

router
  .route('/profile/avatar-image')

  /**
   * @route PATCH /users/profile/avatar
   * @access Private (authenticated users only)
   * @middleware requireAuth, uploadAvatar.single('avatar'), handleMulterError, autoCleanupUploadsDir
   * @file {File} avatar - Profile image file (required, size: <= 5MB(max), types: [image/jpeg, image/png])
   * @description Update the user's avatar image to Cloudinary and save the secure URL in the database.
   * @returns {Object} Success or error message
   * @controller handleUpdateAvatar
   */
  .patch(
    requireAuth,
    uploadAvatarImage.single('avatarImage'),
    handleMulterError,
    autoCleanupUploadsDir,
    handleUpdateAvatar
  )

router
  .route('/profile/user-name')

  /**
   * @route PATCH /users/profile/user-name
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUsername
   * @description Update the user's username
   * @body {string} firstname - Firstname (required, 2-25 characters)
   * @body {string} lastname - Lastname (required, 2-25 characters)
   * @returns {Object} Success or error message
   * @controller handleUpdateUserName
   */
  .patch(requireAuth, validateUsername, handleUpdateUserName)

router
  .route('/profile/bio')

  /**
   * @route PATCH /users/profile/bio
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserBio
   * @description Update the user's bio
   * @body {string} bio - Bio (required, 10 to 300 characters)
   * @returns {Object} Success or error message
   * @controller handleUpdateBio
   */
  .patch(requireAuth, validateUserBio, handleUpdateBio)

router
  .route('/profile/gender')

  /**
   * @route PATCH /users/profile/gender
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserGender
   * @description Update the user's gender
   * @body {string} gender - Gender (required, male/female/other)
   * @returns {Object} Success or error message
   * @controller handleUpdateGender
   */
  .patch(requireAuth, validateUserGender, handleUpdateGender)

router
  .route('/profile/contact')

  /**
   * @route PATCH /users/profile/contact
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserContact
   * @description Update the user's contact information
   * @body {string} contact - Phone number (required, 10 to 15 digits)
   * @returns {Object} Success or error message
   * @controller handleUpdateContact
   */
  .patch(requireAuth, validateUserContact, handleUpdateContact)

router
  .route('/profile/email/update')

  /**
   * @route PATCH /users/profile/email/update
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserEmail
   * @description Update the user's email address
   * @body {string} email - Unique email address (required, max: 254 characters)
   * @returns {Object} Success or error message
   * @controller handleUpdateEmail
   */
  .patch(requireAuth, validateUserEmail, handleUpdateEmail)

router
  .route('/profile/email/verify')
  /**
   * @route POST /users/profile/email/verify
   * @access Private (authenticated users only with isVerified=false)
   * @middleware requireAuth, requireVerified
   * @description Verify the user's email address
   * @body null
   * @returns {Object} Success or error message
   * @controller handleVerifyEmail
   */
  .post(requireAuth, handleVerifyEmail)

router
  .route('/profile/password')

  /**
   * @route PATCH /users/profile/password
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserPassword
   * @description Update the user's password
   * @body {string} currentPassword - Current password (required, min: 8 characters)
   * @body {string} newPassword - New password (required, min: 8 characters)
   * @returns {Object} Success or error message
   * @controller handleUpdatePassword
   */
  .patch(requireAuth, validateUserPassword, handleUpdatePassword)

export default router
