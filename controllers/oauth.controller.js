import { Users } from '../models/index.js'
import { generateToken } from '../utilities/jwtTokens.js'
import { COOKIE_OPTIONS } from '../constants.js'

function handleLoginWithGoogle(req, res) {
  const user = req.user
  //   console.log('user from google strategy:', user);
  const token = generateToken(user)
  res.cookie('jwtToken', token, COOKIE_OPTIONS)
  //   res.status(200).json({ message: 'Login with Google successful!' })
  console.log('Redirect From Google Starting...')
  res.redirect('/')
}

function handleLoginWithGitHub(req, res) {
  const user = req.user
  //   console.log('user from github strategy:', user);
  const token = generateToken(user)
  res.cookie('jwtToken', token, COOKIE_OPTIONS)
  console.log('Redirect From GitHub Starting...')
  res.redirect('/')
}

function handleLoginWithFacebook(req, res) {
  const user = req.user
  //   console.log('user from facebook strategy:', user);
  const token = generateToken(user)
  res.cookie('jwtToken', token, COOKIE_OPTIONS)
  console.log('Redirect From Facebook Starting...')
  res.redirect('/')
}

export {
  handleLoginWithGoogle,
  handleLoginWithGitHub,
  handleLoginWithFacebook,
}
