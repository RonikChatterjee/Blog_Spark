import { Users, Verification } from '../models/index.js'
import { hashPassword, verifyPassword } from '../utilities/hash.js'
import { COOKIE_OPTIONS } from '../constants.js'
import { generateToken } from '../utilities/jwtTokens.js'
import { sendResetPasswordEmail } from '../utilities/nodemailer.js'
import generateUniqueString from '../utilities/nanoid.js'
import dotenv from 'dotenv'
dotenv.config()

/**
 * @constant handleGetUserSignUp
 * @description Controller to render the user signup page
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {RenderingContext} signup page
 */
function handleGetUserSignUp(req, res) {
  // Render the user signup page
  res.render('signup', {
    isLoggedIn: false,
  })
}

/**
 * @constant handleGetUserLogIn
 * @description Controller to render the user login page
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {RenderingContext} login page
 */
function handleGetUserLogIn(req, res) {
  // Render the user login page
  res.render('login', {
    isLoggedIn: false,
  })
}

/**
 * @constant handlePostUserSignUp
 * @description Controller to register the user
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {Promise<void>} - A promise that resolves when the user is registered
 * @throws {Error} - Throws an error if there is an issue with user registration
 */
async function handlePostUserSignUp(req, res) {
  // Destructure userData from request object
  const { firstname, lastname, gender, contact, email, password } =
    req.userData
  try {
    // Check if the user email already exists or not
    let existingUser = await Users.findOne({ email: email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User email already exists' })
    }

    // Check if the user contact already exists or not
    existingUser = await Users.findOne({ contact: contact })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User contact already exists' })
    }

    // Create a new user
    const newUser = await Users.create({
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      contact: contact,
      email: email,
      password: await hashPassword(password),
    })
    return res
      .status(201)
      .json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(`❌ Error in handlePostUserSignUp: ${err}`)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * @constant handlePostUserLogIn
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {Promise<void>} - A promise that resolves when the user is logged in
 * @throws {Error} - Throws an error if the credentials are invalid or there is an Internal Server Error
 */
async function handlePostUserLogIn(req, res) {
  // Destructure user login credentials from request object
  const { email, password } = req.loginData

  try {
    // Check if the user exists
    const existingUser = await Users.findOne({ email: email })
    if (!existingUser) {
      // User does not exists
      return res.status(404).json({ message: 'User not Registered' })
    }

    // Verify the password
    if (await verifyPassword(existingUser.password, password)) {
      // console.log('Existing User: ', existingUser);
      // Password is correct, generate a token
      const encodedToken = generateToken(existingUser)

      // Store the jwtTokens in client cookies
      res.cookie('jwtToken', encodedToken, COOKIE_OPTIONS)
      // Return success response
      return res.status(200).json({ message: 'Login successful' })
    } else {
      // If the password is not correct, return an error
      return res.status(400).json({ message: 'Invalid password' })
    }
  } catch (err) {
    console.error(`❌ Error in handlePostUserSignIn: ${err}`)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

/**
 * @constant handlePostUserLogout
 * @description Controller to log out the user by clearing the JWT token from user cookies
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {Object} - A response object indicating the logout status & message
 */
function handlePostUserLogout(req, res) {
  // Clear the jwtToken cookie
  res.clearCookie('jwtToken')
  return res.status(200).json({ message: 'Logout successful' })
}

/**
 * @constant handlePostForgotPassword
 * @description Controller to send reset password link to user's verified email
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @returns {Object} - A response object indicating the status & message
 * @throws {Error} - Throws an error if there is an issue with sending reset password link
 */
async function handlePostForgotPassword(req, res) {
  // Destructure email from request object
  const { email } = req.body

  try {
    // Check if the user exists
    const existingUser = await Users.findOne({ email })

    if (!existingUser) {
      // User does not exists
      return res.status(404).json({
        message:
          'Email is not registered.\n Please provide a valid email',
      })
    }

    // User exists, send reset password link to user's email
    const passwordResetLINK = generateUniqueString(32)
    const response = await sendResetPasswordEmail(
      email,
      `${process.env.BASE_URL}/verify/reset-password/${passwordResetLINK}`
    )
    if (response) {
      // Email send successfully
      // Delete the record, if a record already exists for the user in Verification collection
      await Verification.deleteMany({
        userId: existingUser._id,
        event: 'RESET_PASSWORD',
      })
      // Store the password reset link in the database
      await Verification.insertOne({
        userId: existingUser._id,
        url: passwordResetLINK,
        event: 'RESET_PASSWORD',
        expiresAt: Date.now() + 6 * 60 * 1000, // 6 minutes from now
      })

      return res
        .status(200)
        .json({ message: 'Reset password link sent successfully.' })
    } else {
      // Failed to send email
      return res.status(500).json({
        message:
          'Failed to send reset password link.\n Please try again later.',
      })
    }
  } catch (error) {
    console.error(`❌ Error in handlePostForgotPassword: ${error}`)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Export the functions to be used in routes
export {
  handleGetUserSignUp,
  handleGetUserLogIn,
  handlePostUserSignUp,
  handlePostUserLogIn,
  handlePostForgotPassword,
  handlePostUserLogout,
}
