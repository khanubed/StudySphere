import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to StudySphere Core API v1',
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server]: StudySphere API running at http://localhost:${PORT}`);
});
