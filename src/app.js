import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



export default app;