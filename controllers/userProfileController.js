import { Users } from '../models/index.js'

function handleGetUserProfile(req, res) {
  // return res.status(200).json({ ...req.user })
  return res.render('userProfile', {
    layout: 'layouts/base_format_loggedin',
  })
}

async function handleUpdateUserProfile(req, res) {}

export { handleGetUserProfile, handleUpdateUserProfile }
