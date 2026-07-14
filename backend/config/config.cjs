require("dotenv").config();

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port : process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: "mysql"
    ,dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      }
    }
  }
};