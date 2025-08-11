import express from 'express'

const router = express.Router()

router.route('/').get((req, res) => {
  res.render('home', {
    layout: 'layouts/base_format_loggedin',
  })
})

export default router
