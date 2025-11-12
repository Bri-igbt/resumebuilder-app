import express from 'express';
import cos from 'cors';
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
app.use(cos());

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/users', userRouter );
app.use('/api/resumes', resumeRouter );
app.use('/api/ai', aiRouter );

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});