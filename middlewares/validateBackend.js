import {
  validateFormData,
  validateEmail,
  validatePassword,
} from '../public/js/validate.js'
// Validate the user data in backend before processing it
function validateSignupData(req, res, next) {
  console.log('Middleware validating user data in backend:')
  // Check if the data is valid

  // Check wheather user info is provided or not
  if (!req.body) {
    return res
      .status(400)
      .json({ message: 'Bad Request: No data provided' })
  }

  // Destructure user info from request body
  const { firstname, lastname, gender, contact, email, password } =
    req.body

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

function validateLoginData(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: 'Please enter login credentials' })
  }
  // Destructure user login credentials from request body
  const { email, password } = req.body

  // Validate email
  const validEmail = validateEmail(email)
  if (!validEmail) {
    return res.status(400).json({ message: validEmail.message })
  }

  // Validate password
  const validPassword = validatePassword(password)
  if (!validPassword) {
    return res.status(400).json({ message: validPassword.message })
  }

  // Attach the validated login data to the request object
  req.loginData = {
    email,
    password,
  }

  next()
}

export { validateSignupData, validateLoginData }
