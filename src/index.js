import dotenv from "dotenv";
import connectMongoBD from "./database/index.js";

dotenv.config({
  path: "/.env",
});



connectMongoBD();