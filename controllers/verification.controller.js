import { Users, Verification } from '../models/index.js'
import { generateToken } from '../utilities/jwtTokens.js'
import { hashPassword } from '../utilities/hash.js'
import { io } from '../index.js'

/**
 * @constant handleVerifyClientEmail
 * @description Verifies the get request link sent in the user's email address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves to void
 * @throws {Error} - Throws an error if LINK verification fails or an internal server error occurs
 */
async function handleVerifyClientEmail(req, res) {
  const { verificationString } = req.params

  try {
    /** Check the verification String present in the database or not **/
    const verificationDetails = await Verification.findOne({
      url: verificationString,
      event: 'EMAIL_VERIFICATION',
    })
    if (!verificationDetails) {
      // Verification Details doesnot exists
      return res.status(404).send('404: Verification link not found')
    }

    // Verification Details exists
    // Destucturing socketId from verificationDetails
    const { socketId, userId } = verificationDetails

    // Update users's isVerified field to true in the database
    await Users.updateOne({ _id: userId }, { isVerified: true })

    // Then remove the verification entry from the database
    await Verification.deleteOne({
      url: verificationString,
      event: 'EMAIL_VERIFICATION',
    })
    res.status(200).send('Email verified successfully')

    // Emit a socket event to notify the client about successful verification
    io.to(socketId).emit('emailVerificationStatus', {
      status: true,
    })
  } catch (error) {
    console.error('Error verifying email:', error)
    return res.status(500).send('Internal Server Error')
  }
}

/**
 * @constant handleVerifyOTP
 * @description Verifies the OTP sent to the user's email address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves to void
 * @throws {Error} - Throws an error if OTP verification fails or an internal server error occurs
 */
async function handleVerifyOTP(req, res) {
  console.log('handleVerifyOTP called')
  const { otpCode } = req.body

  try {
    const userId = req.user._id
    const verificationDetails = await Verification.findOne({
      userId,
      otp: otpCode,
      event: 'EMAIL_VERIFICATION',
    })

    if (!verificationDetails) {
      return res
        .status(400)
        .json({ message: 'Invalid OTP. Enter a valid OTP.' })
    }

    // -------OTP is valid. Verification successful-------
    const socketId = verificationDetails.socketId
    // Delete verification details from the database
    await VerifyEmail.deleteOne({
      userId,
      otp: otpCode,
      event: 'EMAIL_VERIFICATION',
    })

    // Update user's isVerified field to true in the database
    await Users.updateOne({ _id: userId }, { isVerified: true })

    res.status(200).json({ message: 'OTP verified successfully' })

    // Emit a socket event to notify the client about successful verification
    io.to(socketId).emit('emailVerificationStatus', {
      status: true,
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * @constant handleGetResetPassword
 * @description Controller to render the reset password page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {RenderingContext} - Renders the reset password page
 * @throws {Error} - Throws an error if the uniqueURLString is invalid or an internal server error occurs
 */
async function handleGetResetPassword(req, res) {
  const { verificationString } = req.params
  try {
    // Check the verification String present in the database or not
    const verificationDetails = await Verification.findOne({
      url: verificationString,
      event: 'RESET_PASSWORD',
    })

    if (!verificationDetails) {
      // Verification Details doesnot exists
      return res.status(404).send('404: Invalid reset password link')
    }

    // Verification Details exists
    return res.render('resetPassword', {
      layout: 'layouts/temp_format',
      locals: {
        title: 'Reset Password',
      },
    })
  } catch (error) {
    console.error('Error rendering reset password page:', error)
    return res.status(500).send('Internal Server Error')
  }
}

/**
 * @constant handleUpdateNewPassword
 * @description Updates the user's password in the database and sets a new JWT token in the cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns a promise that resolves to void
 * @throws {Error} - Throws an error if updating the password fails or an internal server error occurs
 */
async function handleUpdateNewPassword(req, res) {
  const { verificationString } = req.params
  const { newPassword } = req.body

  try {
    // Check the verification String present in the database or not
    const verificationDetails = await Verification.findOne({
      url: verificationString,
      event: 'RESET_PASSWORD',
    })

    if (!verificationDetails) {
      // uniqueURLString doesnot exists in the DB
      return res
        .status(400)
        .json({ message: 'Invalid reset password link' })
    }

    // uniqueURLString exists in the DB
    const userId = verificationDetails.userId

    // Hash the new password
    const newHashedPassword = await hashPassword(newPassword)

    // Update the user's password in the database
    await Users.updateOne({ _id: userId }, { password: newHashedPassword })

    // Delete the verification entry from the database
    await Verification.deleteOne({
      url: verificationString,
      event: 'RESET_PASSWORD',
      userId: userId,
    })

    return res
      .status(200)
      .json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    return res
      .status(500)
      .json({ message: 'Internal Server Error: ' + error.message })
  }
}

/**
 * @constant handleSetUserCookie
 * @description Sets the JWT token in the user cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 * @throws {Error} - Throws an error if setting the cookie fails
 */
function handleUpdateCookie(req, res) {
  try {
    req.user.isVerified = true
    const newToken = generateToken(req.user)
    res.cookie('jwtToken', newToken, { httpOnly: true })
    res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('Error setting verification cookie:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export {
  handleVerifyClientEmail,
  handleVerifyOTP,
  handleGetResetPassword,
  handleUpdateNewPassword,
  handleUpdateCookie,
}
