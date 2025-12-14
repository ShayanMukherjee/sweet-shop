import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { SECRET } from "./middleware";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hash, "USER"],
    err => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.sendStatus(201);
    }
  );
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (_, user: any) => {
      if (!user) return res.sendStatus(401);

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.sendStatus(401);

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, role: user.role });
    }
  );
});
