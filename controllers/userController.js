import { Users } from '../models/index.js'
import { hashPassword, verifyPassword } from '../utilities/hash.js'
import { generateToken } from '../utilities/jwtTokens.js'

function handleGetUserSignUp(req, res) {
  // Render the user signup page
  res.render('signup', {
    isLoggedIn: false,
  })
}

function handleGetUserLogIn(req, res) {
  // Render the user login page
  res.render('login', {
    isLoggedIn: false,
  })
}

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
      // Password is correct, generate a token
      const encodedToken = generateToken(existingUser)

      // Store the jwtTokens in client cookies
      res.cookie('jwtToken', encodedToken, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: false, // Ensures the cookie is sent over HTTPS only
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set cookie expiration to 1 day
        // maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
      })
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

function handlePostUserLogout(req, res) {
  // Clear the jwtToken cookie
  res.clearCookie('jwtToken')
  return res.status(200).json({ message: 'Logout successful' })
}
// Export the functions to be used in routes
export {
  handleGetUserSignUp,
  handleGetUserLogIn,
  handlePostUserSignUp,
  handlePostUserLogIn,
  handlePostUserLogout,
}
