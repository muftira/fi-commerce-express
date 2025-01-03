require("dotenv").config();

module.exports = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  dialect: process.env.DB_DIALECT,
  seederStorage: "sequelize",
  seederStorageTableName: "SequelizeData",
  db_url: process.env.DB_URL,
};

