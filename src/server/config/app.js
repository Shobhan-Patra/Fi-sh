import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import ErrorHandler from '../middlewares/errorHandling.js';
import rateLimit from 'express-rate-limit';
import { startCleanUp } from '../utils/cleanUp.js';

const app = express();
const logStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), {
  flags: 'a',
});

app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://snipshare.pages.dev';
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
});

// -------- Middleware packages --------
app.use(cors({ origin: FRONTEND_URL })); // Restrict requests to frontend
app.use(cookieParser());
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form submissions
// if (process.env.NODE_ENV === 'production')
//   app.use(morgan('combined', { stream: logStream }));
// For request logging to file
app.use(morgan('dev')); // For request logging to console
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // For additional security headers
app.use('/api', limiter);

//  ----- Server Healthcheck -----
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ message: 'Server working fine' });
});

//  ----- CleanUp of expired data records -----
app.post(`/api/cleanup/${process.env.CRON_SECRET}`, async (req, res) => {
  await startCleanUp();
  res.status(200).json({ message: 'Finished Cleaning Up' });
});

console.log('CORS Middleware configured for origin:', FRONTEND_URL);

app.use(ErrorHandler);
export { app };
