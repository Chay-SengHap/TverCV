import User from "../model/User.js";
import {Resume} from "../model/Resume.js";
import * as userRepository from "../repositories/sqlUserRepository.js";
import jwt from 'jsonwebtoken'
import { where } from "sequelize";

const generateToken = (userId)=>{
  const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : '7d'})
  
  return token
}  


// GET /api/user
export async function getAllUsers(req, res) {
  try {
    const users = await userRepository.getUsers();
    if(!users){
      return res.status()
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const id = req.userId;
    
    const user = await User.findOne({
      where: { id: id }
    });
    
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    
    user.password_hash = undefined;
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users
// POST /api/users/register (or /api/users)
export async function createUser(req, res) {
    try {
        const newUser = await userRepository.createUser(req.body);
        const token = generateToken(newUser.id);
        
        const userData = newUser.toJSON ? newUser.toJSON() : newUser;
        delete userData.password_hash;

        return res.status(201).json({
            message: "Registration successful",
            token,
            user: userData
        });
    } catch (error) {
        console.error("Error creating user:", error);
        const statusCode = error.statusCode || 500;
        const message = error.statusCode ? error.message : "Server error";
        return res.status(statusCode).json({ message });
    }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const updateduser = await userRepository.updateUser(
      req.params.id,
      req.body
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  try {
    await userRepository.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userInstance = await userRepository.loginUser({ email, password });
        const token = generateToken(userInstance.id);
        
        // Convert clean JSON structure and strip tracking metadata safely
        const userData = userInstance.toJSON ? userInstance.toJSON() : userInstance;
        delete userData.password_hash;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        const statusCode = error.statusCode || 500;
        const message = error.statusCode ? error.message : "Server error";
        return res.status(statusCode).json({ message });
    }
}

// controller getting resume
// Get /api/users/resumes

export const getUserResumes = async (req, res)=>{
  try {
    const userId = req.userId

    const resumes = await Resume.findAll({
      where : {
        user_id : userId
      }
    })

    return res.status(200).json({resumes})

  } catch (error) {
    return res.status(400).json({
      message : error.message
    })
  }
}



