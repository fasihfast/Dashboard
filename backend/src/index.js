import express from "express";
import dotenv from "dotenv"
import victimRoute from "./routes/victimRoute.js";
import { connectDB } from "./lib/db.js";
import cors from "cors"

dotenv.config();
const app=express();
// app.use(cors({
//     origin: "http://localhost:5173", // Vite's default port
//     methods: ["GET", "POST", "PUT", "DELETE"],
// }));

app.use(cors({
  origin: "*", // just for debugging
}));

const PORT=5001

app.use(express.json());

app.use("/api/victims", victimRoute);

app.listen(5001, () =>{
    console.log("Server is running on Port " + PORT);
    connectDB();
})