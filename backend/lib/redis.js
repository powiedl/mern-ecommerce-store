import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
// #region REDIS REST (will not be used in this project)
/*
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_TOKEN) {
  console.log('Missing UPSTASH_REDIS_REST_TOKEN environment variable');
  process.exit(1);
}
if (!UPSTASH_REDIS_REST_URL) {
  console.log('Missing UPSTASH_REDIS_REST_URL environment variable');
  process.exit(1);
}
export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});
*/
// #endregion

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
if (!UPSTASH_REDIS_URL) {
  console.log('Missing UPSTASH_REDIS_URL environment variable');
  process.exit(1);
}

export const redis = new Redis(UPSTASH_REDIS_URL);
