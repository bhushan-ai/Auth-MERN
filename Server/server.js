import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connection from "./config/connection.js";
import route from "./routes/authRoute.js";
import dataRoute from "./routes/userDataRoute.js";
const port = process.env.PORT || 8001;

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-mern-bice.vercel.app",
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
//api endpoints
app.get("/", (req, res) => {
  return res.end("welcome");
});

app.use("/api/auth", route);
app.use("/api/user", dataRoute);

connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Started at ${port}`);
    });
  })
  .catch(() => {
    console.log(`something went wrong while connecting to MongoDb`);
  });
export default app;
