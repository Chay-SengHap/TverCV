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
        password_hash: {
            type: DataTypes.TEXT,
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

                if (user.password_hash) {
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password_hash, saltRounds);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed("password_hash") && user.password_hash) {
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password_hash, saltRounds);
                }
            },
        },
    }
);

User.prototype.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password_hash);
};

export default User;