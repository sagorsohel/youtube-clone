import dotenv from "dotenv";
import connectMongoBD from "./database";

dotenv.config({
  path: "/.env",
});



connectMongoBD();