import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

const Skill = sequelize.define(
    "Skill",
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
        skill_name: {
            type: DataTypes.STRING(100),
        },
        proficiency: {
            type: DataTypes.STRING(50),
            defaultValue: "intermediate",
        },
    },
    {
        tableName: "skills",
        timestamps: false,
    }
);

export default Skill;