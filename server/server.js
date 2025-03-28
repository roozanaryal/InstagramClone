import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookiePraser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import connectDB from "./src/db/connectDB.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiePraser());
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
   })
);

//routes
const routeFiles = fs.readdirSync("./routes");
routeFiles.forEach((file) => {
   //dynamic import
   import(`./src/routes/${file}`)
      .then((route) => {
         app.use("/api/v1", route.default);
      })
      .catch((err) => {
         console.log("Failed to load route file: ", err);
      });
});

const server =async() => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}
