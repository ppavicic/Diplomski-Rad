const express = require("express");
const cors = require('cors')
const cookieParser = require('cookie-parser')
require("dotenv").config();

const loginRouter = require('./routes/session');
const teacherProfileRouter = require('./routes/teacherProfile');
const chatGPTRouter = require('./routes/chatGPT');
const taskRouter = require('./routes/task');
const exerciseRouter = require('./routes/exercise');
const studentRouter = require('./routes/student');

const app = express();

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'https://diplomski-frontend.onrender.com']
}));
app.use(express.json());

app.use('/session', loginRouter);
app.use('/teacherProfile', teacherProfileRouter);
app.use('/askAI', chatGPTRouter);
app.use('/task', taskRouter);
app.use('/exercise', exerciseRouter);
app.use('/student', studentRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
