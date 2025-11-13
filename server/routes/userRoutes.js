import express from 'express';
import {getUserById, getUserResumes, loginUser, registerUser} from "../controllers/userController.js";
import protect from "../middlewares/authMiddlewares.js";


const userRouter = express.Router();

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResumes)

export default userRouter;
