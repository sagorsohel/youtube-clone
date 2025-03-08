import dotenv from "dotenv";
import connectMongoBD from "./database/index.js";
import app from "./app.js";

dotenv.config({
  path: "/.env",
});



connectMongoBD()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
