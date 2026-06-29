import User from "./User.js";
import {Resume} from "./Resume.js";
import {PersonalInfo} from "./Personal_info.js";
import {Experience} from "./Experience.js";
import {Education} from "./Education.js";
import {Project} from "./Project.js";
import {Skill} from "./Skill.js";

// User to Resumes (one-to-many)
User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });
Resume.belongsTo(User, { foreignKey: "user_id" });

// Resume to PersonalInfo (one-to-one)
Resume.hasOne(PersonalInfo, { foreignKey: "resume_id", onDelete: "CASCADE" });
PersonalInfo.belongsTo(Resume, { foreignKey: "resume_id" });

// Resume to Experience (one-to-many)
Resume.hasMany(Experience, { foreignKey: "resume_id", onDelete: "CASCADE" });
Experience.belongsTo(Resume, { foreignKey: "resume_id" });

// Resume to Education (one-to-many)
Resume.hasMany(Education, { foreignKey: "resume_id", onDelete: "CASCADE" });
Education.belongsTo(Resume, { foreignKey: "resume_id" });

// Resume to Project (one-to-many)
Resume.hasMany(Project, { foreignKey: "resume_id", onDelete: "CASCADE" });
Project.belongsTo(Resume, { foreignKey: "resume_id" });

// Resume to Skill (one-to-many)
Resume.hasMany(Skill, { foreignKey: "resume_id", onDelete: "CASCADE" });
Skill.belongsTo(Resume, { foreignKey: "resume_id" });

export {
    User,
    Resume,
    PersonalInfo,
    Experience,
    Education,
    Project,
    Skill,
};