function handleGetHomePage(req, res) {
  if (req.isLoggedIn) {
    return res.render('home', {
      layout: 'layouts/base_format_loggedin',
    })
  }
  res.render('home')
}

export { handleGetHomePage }
