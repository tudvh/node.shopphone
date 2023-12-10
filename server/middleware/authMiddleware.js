const authMiddleware = (req, res, next) => {
  if (!req.session.user?.id) {
    res.redirect('/login')
  } else {
    res.locals.session = req.session
    next()
  }
}

module.exports = authMiddleware
