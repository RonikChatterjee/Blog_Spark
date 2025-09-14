function handleGetHomePage(req, res) {
  // debugging
  if (req.isLoggedIn) {
    return res.render('home', {
      layout: 'layouts/base_format_loggedin',
      locals: {
        fullname: `${req.user.firstname} ${req.user.lastname}`,
        profileImg: req.user.profileImg || null,
      },
    })
  }
  res.render('home')
}

export { handleGetHomePage }
