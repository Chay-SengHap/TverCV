
//  This repository shall:
//  - Connect to the database (using the sequelize provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { sequelize } from "../db/database.js";
import dotenv from 'dotenv'
import User from "../model/User.js";
import jwt from 'jsonwebtoken'
dotenv.config()

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return token
}

// Get all users
export async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Create a new user
export async function createUser(newUserData) {
  try {
    const userExist = await User.findOne({
      where: { email: newUserData.email }
    });

    if (userExist) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }

    // Pass the entire newUserData (which contains the plain password field)
    // directly into Sequelize so the virtual field / hook can catch it.
    const newUser = await User.create(newUserData);
    return newUser;
  } catch (error) {
    console.error("Repository error:", error);
    throw error;
  }
}

// Update a user by ID
export async function updateUser(id, updatedData) {
  try {
    const { email, password_hash, role } = updatedData;

    const [affectedRows] = await User.update(
      { email, password_hash, role },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return null;
    }

    const updatedUser = await User.findByPk(id);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Delete a user by ID
export async function deleteUser(id) {
  try {
    const deletedRows = await User.destroy({ where: { id } });
    return deletedRows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: ["id", "name", "email", "password_hash", "role"] // Forces loading the hash
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