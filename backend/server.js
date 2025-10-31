import express from 'express';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import env from './lib/env.js';

const { PORT } = env;

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
