import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

const Project = sequelize.define(
    "Project",
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
        name: {
            type: DataTypes.STRING(255),
        },
        type: {
            type: DataTypes.STRING(100),
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: "projects",
        timestamps: false,
    }
);

export default Project;