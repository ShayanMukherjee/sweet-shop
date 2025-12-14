import express from "express";
import cors from "cors";
import sweetsRouter from "./sweets";
import { authRouter } from "./auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter); // ✅ FIXED
app.use("/api/sweets", sweetsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
