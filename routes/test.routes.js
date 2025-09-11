import express from 'express'

const router = express.Router()

router.route('/').get((req, res) => {
  res.render('resetPassword', {
    layout: 'layouts/temp_format',
    locals: {
      title: 'Reset Password',
    },
  })
})

export default router
