// backend/scripts/testUserRepository.js
//
// Quick manual smoke test for sqlUserRepository.js
// Run with: node backend/scripts/testUserRepository.js
//
// Logs the input/output of each repository function so you can verify
// Sequelize is actually querying the DB correctly.

import dotenv from 'dotenv'
dotenv.config()

import { sequelize } from "../db/database.js";
import * as userRepository from "../repositories/sqlUserRepository.js";

const log = (label, data) => {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
};

const logError = (label, error) => {
  console.log(`\n=== ${label} (ERROR) ===`);
  console.log("message:", error.message);
  if (error.statusCode) console.log("statusCode:", error.statusCode);
};

async function run() {
  try {
    // 0. Confirm DB connection works at all
    await sequelize.authenticate();
    console.log("DB connection OK");

    // Use a throwaway email so repeated test runs don't collide
    const testEmail = `test_${Date.now()}@example.com`;
    let createdUser;

    // 1. createUser
    try {
      createdUser = await userRepository.createUser({
        name: "Test User",
        email: testEmail,
        password: "Password123!" // adjust field name to match your model's virtual field
      });
      log("createUser", createdUser.toJSON ? createdUser.toJSON() : createdUser);
    } catch (error) {
      logError("createUser", error);
    }

    // 1b. createUser duplicate email (should throw statusCode 400)
    try {
      await userRepository.createUser({
        name: "Test User 2",
        email: testEmail,
        password: "Password123!"
      });
      console.log("\n=== createUser duplicate check FAILED (should have thrown) ===");
    } catch (error) {
      logError("createUser duplicate (expected)", error);
    }

    // 2. getUsers
    try {
      const users = await userRepository.getUsers();
      log("getUsers (count only)", { count: users.length });
    } catch (error) {
      logError("getUsers", error);
    }

    // 3. getUserById
    if (createdUser) {
      try {
        const user = await userRepository.getUserById(createdUser.id);
        log("getUserById", user ? user.toJSON() : user);
      } catch (error) {
        logError("getUserById", error);
      }
    }

    // 4. getUserById with non-existent id
    try {
      const user = await userRepository.getUserById(9999999);
      log("getUserById (nonexistent id)", user); // should log null
    } catch (error) {
      logError("getUserById (nonexistent id)", error);
    }

    // 5. loginUser - correct credentials
    try {
      const loggedIn = await userRepository.loginUser({
        email: testEmail,
        password: "Password123!"
      });
      log("loginUser (correct creds)", loggedIn.toJSON ? loggedIn.toJSON() : loggedIn);
    } catch (error) {
      logError("loginUser (correct creds)", error);
    }

    // 6. loginUser - wrong password (should throw statusCode 401)
    try {
      await userRepository.loginUser({
        email: testEmail,
        password: "WrongPassword"
      });
      console.log("\n=== loginUser wrong password check FAILED (should have thrown) ===");
    } catch (error) {
      logError("loginUser (wrong password, expected)", error);
    }

    // 7. loginUser - nonexistent email (should throw statusCode 401)
    try {
      await userRepository.loginUser({
        email: "doesnotexist@example.com",
        password: "whatever"
      });
      console.log("\n=== loginUser nonexistent email check FAILED (should have thrown) ===");
    } catch (error) {
      logError("loginUser (nonexistent email, expected)", error);
    }

    // 8. updateUser
    if (createdUser) {
      try {
        const updated = await userRepository.updateUser(createdUser.id, {
          email: testEmail, // keep same email or change to test uniqueness handling
          role: "admin"
        });
        log("updateUser", updated ? updated.toJSON() : updated);
      } catch (error) {
        logError("updateUser", error);
      }
    }

    // 9. updateUser with non-existent id (should return null)
    try {
      const updated = await userRepository.updateUser(9999999, { role: "user" });
      log("updateUser (nonexistent id)", updated); // should log null
    } catch (error) {
      logError("updateUser (nonexistent id)", error);
    }

    // 10. deleteUser
    if (createdUser) {
      try {
        const deletedCount = await userRepository.deleteUser(createdUser.id);
        log("deleteUser", { deletedRows: deletedCount }); // should be 1
      } catch (error) {
        logError("deleteUser", error);
      }
    }

    // 11. deleteUser again (should return 0, nothing left to delete)
    if (createdUser) {
      try {
        const deletedCount = await userRepository.deleteUser(createdUser.id);
        log("deleteUser (already deleted)", { deletedRows: deletedCount }); // should be 0
      } catch (error) {
        logError("deleteUser (already deleted)", error);
      }
    }

  } catch (error) {
    console.error("Fatal error running tests:", error);
  } finally {
    await sequelize.close();
    console.log("\nDB connection closed.");
  }
}

run();