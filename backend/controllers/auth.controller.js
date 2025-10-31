import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import env from '../lib/env.js';
import { redis } from '../lib/redis.js';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV } = env;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60
  ); // EXpires in 7 days (in seconds)
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, //prevent XSS attacks,
    secure: NODE_ENV === 'production',
    sameSite: 'strict', // prevents CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, //prevent XSS attacks,
    secure: NODE_ENV === 'production',
    sameSite: 'strict', // prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });

    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    const userWithoutPassword = user._doc; // the user document
    delete userWithoutPassword.password; // remove the password attribute from the cached document
    res.status(201).json({
      user: userWithoutPassword,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  res.send('Login route called');
};
export const logout = async (req, res) => {
  res.send('logout route called');
};
