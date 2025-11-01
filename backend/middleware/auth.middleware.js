import jwt from 'jsonwebtoken';
import env from '../lib/env.js';
import User from '../models/user.model.js';

const { ACCESS_TOKEN_SECRET } = env;
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No access token provided' });
    }

    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Unknown user' });
      }
      req.user = user;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ message: 'Unauthorized - Access token expired' });
      }
      throw error;
    }
  } catch (error) {
    console.log('Error in protectRoute middleware', error.message);
    return res
      .status(401)
      .json({ message: 'Unauthorized - Invalid access token' });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req?.user?.role !== 'admin')
    return res.status(403).json({ message: 'Access denied - admin only' });
  return next();
};
