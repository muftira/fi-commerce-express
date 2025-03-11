const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const ErrorResponse = require('../helpers/error.helper');

const JWT_SECRET = process.env.JWT_SECRET;

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid Token !!!',
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Invalid or Expired Token !!!',
    });
  }
};

const adminRole = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      throw new ErrorResponse(
        403,
        "you don't have permission to access this resource"
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authentication,
  adminRole,
};
