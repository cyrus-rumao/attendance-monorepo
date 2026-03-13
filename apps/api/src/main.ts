
import dotenv from 'dotenv';
dotenv.config({override: true});
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.route.js';
import subjectRoutes from './modules/subjects/subject.route.js';
import timetableRoutes from './modules/timetable/timetable.route.js';
import attendanceRoutes from './modules/attendance/attendance.route.js';
import { connectDB } from './config/db.js';
const app: Application = express();
connectDB();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, async () => {
  console.log(`Server flaming on port ${PORT}`);
  
});
