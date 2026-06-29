import { DataTypes } from "sequelize";
import {sequelize }from "../db/database.js";

export const Resume = sequelize.define(
    "Resume",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            defaultValue: "Untitled Resume",
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue : false
        },
        public_slug: {
            type: DataTypes.STRING(100),
            unique: true,
            
        },
        template: {
            type: DataTypes.STRING(100),
            defaultValue: "classic",
        },
        accent_color: {
            type: DataTypes.STRING(20),
            defaultValue: "#3B82F6",
        },
        professional_summary: {
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "resumes",
        timestamps: false,
    }
);

