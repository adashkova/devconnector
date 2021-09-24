const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // const token = req.headers('x-auth-token')
  const token =
    req.body.token || req.query.token || req.headers['x-auth-token'];

  if (!token) res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
