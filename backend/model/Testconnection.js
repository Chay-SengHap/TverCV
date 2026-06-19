import sequelize from "../db/database.js";

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection successful — Sequelize can reach the database.");
    } catch (error) {
        console.error("Connection failed:", error.message);
    } finally {
        await sequelize.close();
    }
}


import User from "./User.js";

const users = await User.findAll();

console.log(users[0]);
testConnection();