import jwt from 'jsonwebtoken';
import User from '../models/USER_MODEL.js';
import rateLimit from 'express-rate-limit';


export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id);

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Your role is '${req.user.role}', but this route requires: ${allowedRoles.join(', ')}.` 
      });
    }
    next(); 
  };
};

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: "Too many OTP requests, please try again 15 minute later",
});