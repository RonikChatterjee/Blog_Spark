import { verifyToken } from '../utilities/jwtTokens.js'

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
  } catch (err) {
    return res.redirect('/user/login')
  }
  next()
}

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

function authOptional(req, res, next) {
  // debugging
  console.log(
    'authOptional middleware called for:',
    req.method,
    req.url
  )
  // Check if the user is logged in or not
  const token = req.cookies?.jwtToken
  if (!token) {
    req.isLoggedIn = false
  } else {
    try {
      const decoded = verifyToken(token)
      req.isLoggedIn = true
      req.user = decoded
    } catch (err) {
      req.isLoggedIn = false
      res.clearCookie('jwtToken')
    }
  }
  next()
}

export { requireAuth, requireGuest, authOptional }
