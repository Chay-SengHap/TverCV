
//  This repository shall:
//  - Connect to the database (using the sequelize provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { sequelize } from "../db/database.js";
import dotenv from 'dotenv'
import User from "../model/User.js";
import jwt from 'jsonwebtoken'
dotenv.config()

const generateToken = (userId)=>{
  const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : '7d'})

  return token
}  
// Get all users
export async function getUsers() {
  
   try {
    const [rows] = await sequelize.query("select *from users;");
    return rows;
   } catch (error) {
    console.error(error);
   }
}

// Get user by ID
export async function getUserById(id) {
   try {
     const [rows] = await sequelize.query("select * from users where id = ? ", [id])
        return rows[0];
   } catch (error) {
    console.error(error);
   }
}


// Create a new user
export async function createUser(newUserData) {
    
    try {
        const userExist = await User.findOne({
            where : {email : newUserData.email}
        })

        if(userExist){
            const error = new Error("User already exists with this email");
            error.statusCode = 400;
            throw error;
        }
        const newUser = await User.create(newUserData)
        const token = generateToken(newUser.id)
        newUser.password_hash = undefined
        return newUser
    } catch (error) {
        console.error(error);
    }
}

// Update an user by ID
export async function updateUser(id, updatedData) {

    try {
        const {id, email, password_hash, role, created_at} = updatedData;
        const [result] = await sequelize.query("update users set id = ?, email = ?, password_hash = ?, role = ?, created_at = ? where id = ?", [id, email, password_hash, role, created_at])
        return result;
    } catch (error) {
        console.error(error)
    }
}

// Delete an user by ID
export async function deleteUser(id) {
    
    try {
        const [result] = await sequelize.query("delete from users where id = ?", [id])
        return result
    } catch (error) {
        console.error(error);
    }
}
export async function loginUser({ email, password }) {
    try {
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        return user;
    } catch (error) {
        console.error("Repository error during login:", error);
        throw error;
    }
}