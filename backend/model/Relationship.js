import User from "./User.js";
import { Resume } from "./Resume.js";
import { PersonalInfo } from "./Personal_info.js";
import { Experience } from "./Experience.js";
import { Education } from "./Education.js";
import { Project } from "./Project.js";
import { Skill } from "./Skill.js";

// ===============================
// User ↔ Resume (One-to-Many)
// ===============================
User.hasMany(Resume, {
    foreignKey: "user_id",
    as: "resumes",
    onDelete: "CASCADE",
});

Resume.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

// ===============================
// Resume ↔ PersonalInfo (One-to-One)
// ===============================
Resume.hasOne(PersonalInfo, {
    foreignKey: "resume_id",
    as: "personal_info",
    onDelete: "CASCADE",
});

PersonalInfo.belongsTo(Resume, {
    foreignKey: "resume_id",
    as: "resume",
});

// ===============================
// Resume ↔ Experience (One-to-Many)
// ===============================
Resume.hasMany(Experience, {
    foreignKey: "resume_id",
    as: "experiences",
    onDelete: "CASCADE",
});

Experience.belongsTo(Resume, {
    foreignKey: "resume_id",
    as: "resume",
});

// ===============================
// Resume ↔ Education (One-to-Many)
// ===============================
Resume.hasMany(Education, {
    foreignKey: "resume_id",
    as: "education",
    onDelete: "CASCADE",
});

Education.belongsTo(Resume, {
    foreignKey: "resume_id",
    as: "resume",
});

// ===============================
// Resume ↔ Project (One-to-Many)
// ===============================
Resume.hasMany(Project, {
    foreignKey: "resume_id",
    as: "projects",
    onDelete: "CASCADE",
});

Project.belongsTo(Resume, {
    foreignKey: "resume_id",
    as: "resume",
});

// ===============================
// Resume ↔ Skill (One-to-Many)
// ===============================
Resume.hasMany(Skill, {
    foreignKey: "resume_id",
    as: "skills",
    onDelete: "CASCADE",
});

Skill.belongsTo(Resume, {
    foreignKey: "resume_id",
    as: "resume",
});

export {
    User,
    Resume,
    PersonalInfo,
    Experience,
    Education,
    Project,
    Skill,
};