import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

const PersonalInfo = sequelize.define(
    "PersonalInfo",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        resume_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        full_name: {
            type: DataTypes.STRING(255),
        },
        profession: {
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(255),
        },
        phone: {
            type: DataTypes.STRING(50),
        },
        location: {
            type: DataTypes.STRING(255),
        },
        linkedin: {
            type: DataTypes.STRING(255),
        },
        website: {
            type: DataTypes.STRING(255),
        },
        image_url: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: "personal_info",
        timestamps: false,
    }
);

export default PersonalInfo;