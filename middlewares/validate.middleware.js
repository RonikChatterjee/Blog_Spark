import {
  validateFormData,
  validateBio,
  validateName,
  validateGender,
  validateContact,
  validateEmail,
  validatePassword,
  validateOTP,
} from '../public/js/validate.js'

/**
 * @constant validateSignupData
 * @description Middleware to validate user signup data before controller process it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User data containing firstname, lastname, gender, contact, email, password
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateSignupData(req, res, next) {
  console.log('Middleware validating user data in backend:')
  // Check wheather user info is provided or not
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  // Destructure user info from request body
  const { firstname, lastname, gender, contact, email, password } =
    req.body

  // Check if the data is valid
  const error = validateFormData(req.body)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // Attach the validated user data to the request object
  req.userData = {
    firstname,
    lastname,
    gender,
    contact,
    email,
    password,
  }
  next()
}

/**
 * @constant validateLoginData
 * @description Middleware to validate user login data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User login data containing email and password
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or invalid data is provided
 */
function validateLoginData(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: 'Please enter login credentials' })
  }
  // Destructure user login credentials from request body
  const { email, password } = req.body

  // Validate email
  let error = validateEmail(email)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // Validate password
  error = validatePassword(password)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // Attach the validated login data to the request object
  req.loginData = {
    email,
    password,
  }

  next()
}

/**
 * @constant validateBio
 * @description Middleware to validate bio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User bio data containing bio
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserBio(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { bio } = req.body

  // Validate bio
  const error = validateBio(bio)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If bio is valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUsername
 * @description Middleware to validate username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User name data containing firstname and lastname
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUsername(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { firstname, lastname } = req.body

  let error
  // Validate firstname
  error = validateName(firstname)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // Validate lastname
  error = validateName(lastname)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }
  // If both names are valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUserGender
 * @description Middleware to validate user gender
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User gender data containing gender
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserGender(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { gender } = req.body

  // Validate gender
  const error = validateGender(gender)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If gender is valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUserContact
 * @description Middleware to validate user contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User contact data containing contact
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserContact(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { contact } = req.body

  // Validate contact
  const error = validateContact(contact)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If contact is valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUserEmail
 * @description Middleware to validate user email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User email data containing email
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserEmail(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { email } = req.body

  // Validate email
  const error = validateEmail(email)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If email is valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUserPassword
 * @description Middleware to validate user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User password data containing currentPassword and newPassword
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserPassword(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { currentPassword, newPassword } = req.body

  let error
  // Validate currentpassword & newPassword
  error = validatePassword(currentPassword)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  error = validatePassword(newPassword)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If password is valid, proceed to the next middleware
  next()
}

/**
 * @constant validateUserOTP
 * @description Middleware to validate user OTP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @body {Object<req.body>} - User OTP data containing otpCode
 * @returns {void}
 * @throws {Error} Bad Request if no data is provided or validation fails
 */
function validateUserOTP(req, res, next) {
  console.log('validateUserOTP called')
  console.log('req.body:', req.body)
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  const { otpCode } = req.body

  // Validate OTP
  const error = validateOTP(otpCode)
  if (!error.isValid) {
    return res.status(400).json({ message: error.message })
  }

  // If OTP is valid, proceed to the next middleware
  next()
}

export {
  validateSignupData,
  validateLoginData,
  validateUserBio,
  validateUsername,
  validateUserGender,
  validateUserContact,
  validateUserEmail,
  validateUserPassword,
  validateUserOTP,
}
