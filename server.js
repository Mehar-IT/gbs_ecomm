const _ = require("./config/env");
const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shuting down server due to uncaught Exception`);
  process.exit(1);
});

connectDatabase(app);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`shuting down server due to unhandled promise rejection`);
  // server.close(() => {
  process.exit(1);
  // });
});
