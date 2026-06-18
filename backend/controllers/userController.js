import * as userRepository from "../repositories/sqlUserRepository.js";



// GET /api/user
export async function getAllUsers(req, res) {
  try {
    const users = await userRepository.getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users
export async function createUser(req, res) {
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
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
