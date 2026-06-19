import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

const Experience = sequelize.define(
    "Experience",
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
        company: {
            type: DataTypes.STRING(255),
        },
        job_title: {
            type: DataTypes.STRING(255),
        },
        start_date: {
            type: DataTypes.STRING(50),
        },
        end_date: {
            type: DataTypes.STRING(50),
        },
        is_current: {
            type: DataTypes.BOOLEAN,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: "experience",
        timestamps: false,
    }
);

export default Experience;