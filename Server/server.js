import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection from "./config/connection.js";
import route from "./routes/authRoute.js";
import dataRoute from "./routes/userDataRoute.js";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-mern-your-frontend.vercel.app",
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("welcome"));
app.use("/api/auth", route);
app.use("/api/user", dataRoute);

connection()
  .then(() =>
    app.listen(port, () => console.log(`Server started on port ${port}`))
  )
  .catch((err) => console.error("DB connection error:", err));
