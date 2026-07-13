import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser , loginUser , getUserResumes } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No users found.
 *       500:
 *         description: Server error.
 */
userRouter.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful.
 *       400:
 *         description: Invalid input or user already exists.
 *       500:
 *         description: Server error.
 */
userRouter.post("/register", createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Server error.
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/users/data:
 *   get:
 *     summary: Get logged-in user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
userRouter.get("/data", protect, getUserById);

/**
 * @swagger
 * /api/users/resumes:
 *   get:
 *     summary: Get resumes of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resumes belonging to the user.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
userRouter.get("/resumes", protect , getUserResumes);

export default userRouter;
