import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes.ts"; // ⚠️ .js si tu es en ESM

dotenv.config();

const app = express();

// Autorise les requêtes du frontend local (Next.js)
app.use(
  cors({
    origin: "http://localhost:3000", // autorise uniquement ton front en dev
    credentials: true,
  })
);

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
