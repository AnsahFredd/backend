import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth);

app.listen(5000, () => {
  console.log(`Port started at port ${PORT}`);
});
