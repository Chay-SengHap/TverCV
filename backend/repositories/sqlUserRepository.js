
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { pool } from "../db/databaseRepo.js";

// Get all users
export async function getUsers() {
  
   try {
    const [rows] = await pool.query("select *from users;");
    return rows;
   } catch (error) {
    console.error(error);
   }
}

// Get user by ID
export async function getUserById(id) {
   try {
     const [rows] = await pool.query("select *from users where id = ? ", [id])
        return rows[0];
   } catch (error) {
    console.error(error);
   }
}


// Create a new user
export async function createUser(user) {
    
    try {
        const {id, email, password_hash, role, created_at} = user;
        const [insertData] = await pool.query("insert into users(id, email, password_hash, role, created_at) values(?, ?, ?, ?)", [id, email, password_hash, role, created_at])
        return insertData;
    } catch (error) {
        console.error(error);
    }
}

// Update an user by ID
export async function updateUser(id, updatedData) {

    try {
        const {id, email, password_hash, role, created_at} = updatedData;
        const [result] = await pool.query("update users set id = ?, email = ?, password_hash = ?, role = ?, created_at = ? where id = ?", [id, email, password_hash, role, created_at])
        return result;
    } catch (error) {
        console.error(error)
    }
}

// Delete an user by ID
export async function deleteUser(id) {
    
    try {
        const [result] = await pool.query("delete from users where id = ?", [id])
        return result
    } catch (error) {
        console.error(error);
    }
}
