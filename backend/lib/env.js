import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;

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

export default {
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  MONGO_URI,
  UPSTASH_REDIS_URL,
  NODE_ENV,
};
