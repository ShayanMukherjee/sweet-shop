import { Router } from "express";
import { db } from "./db";
import { authenticate, authorizeAdmin } from "./middleware";

const router = Router();

/* =========================
   GET ALL SWEETS
========================= */
router.get("/", authenticate, (_req, res) => {
  db.all("SELECT * FROM sweets", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/* =========================
   ADD SWEET (ADMIN) — DUPLICATE SAFE
========================= */
router.post("/", authenticate, authorizeAdmin, (req, res) => {
  const { name, category, price, quantity } = req.body;

  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.run(
    `INSERT INTO sweets (name, category, price, quantity)
     VALUES (?, ?, ?, ?)`,
    [name, category, price, quantity],
    function (err) {
      if (err) {
        // UNIQUE constraint (duplicate sweet name)
        if (err.message.includes("UNIQUE")) {
          return res
            .status(409)
            .json({ error: "Sweet with this name already exists" });
        }
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ id: this.lastID });
    }
  );
});

/* =========================
   PURCHASE SWEET
========================= */
router.post("/:id/purchase", authenticate, (req, res) => {
  const id = Number(req.params.id);

  db.get(
    "SELECT quantity FROM sweets WHERE id = ?",
    [id],
    (err, row: { quantity: number }) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row || row.quantity <= 0) {
        return res.status(400).json({ error: "Out of stock" });
      }

      db.run(
        "UPDATE sweets SET quantity = quantity - 1 WHERE id = ?",
        [id],
        (err2) => {
          if (err2) {
            return res.status(500).json({ error: err2.message });
          }
          res.json({ success: true });
        }
      );
    }
  );
});

/* =========================
   RESTOCK SWEET (ADMIN)
========================= */
router.post("/:id/restock", authenticate, authorizeAdmin, (req, res) => {
  const id = Number(req.params.id);
  const qtyToAdd = Number(req.body.quantity);

  if (!qtyToAdd || qtyToAdd <= 0) {
    return res.status(400).json({ error: "Invalid restock quantity" });
  }

  db.get(
    "SELECT quantity FROM sweets WHERE id = ?",
    [id],
    (err, row: { quantity: number }) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ error: "Sweet not found" });
      }

      const newQuantity = row.quantity + qtyToAdd;

      db.run(
        "UPDATE sweets SET quantity = ? WHERE id = ?",
        [newQuantity, id],
        (err2) => {
          if (err2) {
            return res.status(500).json({ error: err2.message });
          }

          res.json({ success: true, quantity: newQuantity });
        }
      );
    }
  );
});

/* =========================
   UPDATE SWEET (ADMIN)
   (price / category only)
========================= */
router.put("/:id", authenticate, authorizeAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { price, category } = req.body;

  if (price == null && !category) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (price != null) {
    fields.push("price = ?");
    values.push(price);
  }

  if (category) {
    fields.push("category = ?");
    values.push(category);
  }

  values.push(id);

  db.run(
    `UPDATE sweets SET ${fields.join(", ")} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

/* =========================
   DELETE SWEET (ADMIN)
========================= */
router.delete("/:id", authenticate, authorizeAdmin, (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM sweets WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

export default router;
