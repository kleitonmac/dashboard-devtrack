import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "https://devtracker-frontend.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir chamadas como Postman ou server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DevTracker API",
    status: "online",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
