import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser , loginUser , getUserResumes } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = Router();
userRouter.get("/", getAllUsers);

userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect , getUserResumes);

export default userRouter;
