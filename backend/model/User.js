import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        // This is your actual database column where the secure hash is stored
        password_hash: {
            type: DataTypes.TEXT,
        },
        // This is a temporary memory-only slot that catches 
        // the "password" field from your React frontend
        password: {
            type: DataTypes.VIRTUAL,
        },
        role: {
            type: DataTypes.STRING(50),
            defaultValue: "user",
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "users",
        timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
                // Custom Auto ID Prefix Logic (u001, u002...)
                const lastUser = await User.findOne({
                    order: [["id", "DESC"]],
                    attributes: ["id"],
                    raw: true,
                });

                let nextNumber = 1;
                if (lastUser && lastUser.id.startsWith("u")) {
                    const numericPart = parseInt(lastUser.id.substring(1), 10);
                    if (!isNaN(numericPart)) {
                        nextNumber = numericPart + 1;
                    }
                }
                const paddedNumber = String(nextNumber).padStart(3, "0");
                user.id = `u${paddedNumber}`;

                // Catch the temporary virtual 'password' from React and hash it safely!
                if (user.password) {
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password, saltRounds);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed("password") && user.password) {
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password, saltRounds);
                }
            },
        },
    }
);

// Companion method for validating logins later
User.prototype.comparePassword = async function (plainPassword) {
    if (!this.password_hash) {
        throw new Error("Missing password hash database registry entry.");
    }
    return await bcrypt.compare(plainPassword, this.password_hash);
};

export default User;