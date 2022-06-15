const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err || !user) {
      res.status(403).send({
        error: '계정이 존재하지 않거나, 해당 정보에 접근 권한이 없습니다.'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}