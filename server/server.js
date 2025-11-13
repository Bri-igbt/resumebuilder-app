import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

//database connection
await connectDB();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'], // Common frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/users', userRouter );
app.use('/api/resumes', resumeRouter );
app.use('/api/ai', aiRouter );

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});