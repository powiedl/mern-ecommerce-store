import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!ACCESS_TOKEN_SECRET) {
  console.log('Error: Missing environment variable ACCESS_TOKEN_SECRET');
  process.exit(1);
}
if (!REFRESH_TOKEN_SECRET) {
  console.log('Error: Missing environment variable REFRESH_TOKEN_SECRET');
  process.exit(1);
}
if (!MONGO_URI) {
  console.log('Error: Missing environment variable MONGO_URI');
  process.exit(1);
}
if (!UPSTASH_REDIS_URL) {
  console.log('Missing UPSTASH_REDIS_URL environment variable');
  process.exit(1);
}
if (!CLOUDINARY_CLOUD_NAME) {
  console.log('Missing environment variable CLOUDINARY_CLOUD_NAME');
  process.exit(1);
}
if (!CLOUDINARY_API_KEY) {
  console.log('Missing environment variable CLOUDINARY_API_KEY');
  process.exit(1);
}
if (!CLOUDINARY_API_SECRET) {
  console.log('Missing environment variable CLOUDINARY_API_SECRET');
  process.exit(1);
}
if (!STRIPE_PUBLIC_KEY) {
  console.log('Missing environment variable STRIPE_PUBLIC_KEY');
  process.exit(1);
}
if (!STRIPE_SECRET_KEY) {
  console.log('Missing environment variable STRIPE_SECRET_KEY');
  process.exit(1);
}
export default {
  PORT,
  CLIENT_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MONGO_URI,
  UPSTASH_REDIS_URL,
  NODE_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
};
