import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";     
import authRoutes from "./routes/auth.js"; 
import githubRoutes from "./routes/githubTimeline.js";
import config from "./config/config.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 

connectDB();

app.use("/auth", authRoutes);
app.use("/github", githubRoutes);

app.get("/", (req, res) => res.send("Server is running "));
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);
console.log("DEFAULT_EMAIL:", process.env.DEFAULT_EMAIL);


app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
