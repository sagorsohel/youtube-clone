import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
const app = express();

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)


export default app;