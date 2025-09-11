import express from 'express'
const router = express.Router()

// Importing Middlewares
import { requireAuth } from '../middlewares/authentication.middleware.js'
import {
  validateUserOTP,
  validateUserPassword,
} from '../middlewares/validate.middleware.js'

//  Importing Controllers
import {
  handleVerifyClientEmail,
  handleVerifyOTP,
  handleGetResetPassword,
  handleUpdateNewPassword,
  handleUpdateCookie,
} from '../controllers/verification.controller.js'

router
  .route('/email/verify-otp')
  /**
   * @route POST /verify/email/verify-otp
   * @access Private (authenticated users only)
   * @middleware requireAuth, validateUserOTP
   * @description Verify OTP sent in the user email address
   * @body { otpCode } - OTP code sent to the user's email address (required)
   * @returns {Object} JSON object with success or error message
   * @controller handleVerifyOTP
   */
  .post(requireAuth, validateUserOTP, handleVerifyOTP)

router
  .route('/email/:verificationString')
  /**
   * @route GET /verify/email/:verificationString
   * @access Public
   * @description Verify email address
   * @params {String<verificationString>} - Verification string from the mail sent in user email address (required)
   * @returns {Object} JSON object with success or error message
   * @controller handleVerifyClientEmail
   */
  .get(handleVerifyClientEmail)

router
  .route('/reset-password/:verificationString')

  /**
   * @route GET /verify/reset-password/:verificationString
   * @access Public
   * @description Render the reset password page
   * @params {String<verificationString>} - Verification string from the mail sent in user email address (required)
   * @returns {Object} JSON object with success or error message
   * @controller handleGetResetPassword
   */
  .get(handleGetResetPassword)

  /**
   * @route PATCH /verify/reset-password/:verificationString
   * @access Public
   * @middleware validateUserPassword
   * @description Update the user's password
   * @params {String<verificationString>} - Verification string from the mail sent in user email address (required)
   * @body { newPassword } - The new password for the user (required)
   * @returns {Object} JSON object with success or error message
   * @controller handleUpdateNewPassword
   */
  .patch(validateUserPassword, handleUpdateNewPassword)

router
  .route('/set-cookie')
  /**
   * @route PATCH /verify/set-cookie
   * @access Private (authenticated users only)
   * @description Set isVerified field in the JWT token cookie after successful email verification
   * @returns {Object} JSON object with success or error message
   * @controller handleSetCookie
   */
  .patch(requireAuth, handleUpdateCookie)

export default router
