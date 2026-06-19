import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

const Education = sequelize.define(
    "Education",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        resume_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        institution: {
            type: DataTypes.STRING(255),
        },
        degree: {
            type: DataTypes.STRING(255),
        },
        field: {
            type: DataTypes.STRING(255),
        },
        graduation_date: {
            type: DataTypes.STRING(50),
        },
        gpa: {
            type: DataTypes.STRING(20),
        },
    },
    {
        tableName: "education",
        timestamps: false,
    }
);

export default Education;