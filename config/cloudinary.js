const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLODINARY,
  api_key: process.env.API_KEY_CLODINARY,
  api_secret: process.env.API_SECRET_CLODINARY,
});

module.exports = cloudinary;