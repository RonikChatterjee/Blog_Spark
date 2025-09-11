import { verifyToken } from '../utilities/jwtTokens.js'

/**
 * @constant requireAuth
 * @description Middleware to protect routes that require authentication.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {redirects to ('/user/login') if not authenticated}
 * @returns {void}
 */
function requireAuth(req, res, next) {
  // debugging
  console.log('requireAuth middleware called', req.method, req.url)
  // Check if the user is logged in or not
  const token = req.cookies?.jwtToken
  if (!token) {
    return res.redirect('/user/login')
  }
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    console.log('User in middleware(requireAuth): ', decoded)
  } catch (err) {
    res.clearCookie('jwtToken')
    return res.redirect('/user/login')
  }
  next()
}

/**
 * @constant requireGuest
 * @description Middleware to restrict access to routes for authenticated users only.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {redirects to ('/') if authenticated}
 * @returns {void}
 */
function requireGuest(req, res, next) {
  // debugging
  console.log('requireGuest middleware called', req.method, req.url)
  // Check if the user is logged in or not
  const token = req.cookies?.jwtToken
  if (token) {
    try {
      verifyToken(token)
      return res.redirect('/')
    } catch (err) {
      res.clearCookie('jwtToken')
    }
  }
  next()
}

/**
 * @constant authOptional
 * @description Middleware to optionally authenticate users.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function authOptional(req, res, next) {
  // debugging
  console.log(
    'authOptional middleware called for:',
    req.method,
    req.url
  )
  // Check if the user is logged in or not
  const token = req.cookies?.jwtToken
  console.log('token in authOptional middleware: ', token)
  if (!token) {
    req.isLoggedIn = false
  } else {
    try {
      const decoded = verifyToken(token)
      req.isLoggedIn = true
      req.user = decoded
      console.log('User in middleware(authOptional): ', decoded)
    } catch (err) {
      req.isLoggedIn = false
      res.clearCookie('jwtToken')
    }
  }
  next()
}

/**
 * @constant requireEmailVerified
 * @description Middleware to ensure the user's email is verified.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function checkEmailVerificationStatus(req, res, next) {
  if (req.user && !req.user.isVerified) {
    return res.redirect('/user/profile')
  }
  next()
}

export {
  requireAuth,
  requireGuest,
  authOptional,
  checkEmailVerificationStatus,
}
