import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

type Sweet = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);

  // Admin add form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Restock
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState("");

  // 🔥 Update sweet
  const [editId, setEditId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  /* AUTH GUARD */
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const theme = dark
    ? {
        bg: "#020617",
        card: "#0f172a",
        text: "#f8fafc",
        muted: "#94a3b8",
      }
    : {
        bg: "#f8fafc",
        card: "#ffffff",
        text: "#020617",
        muted: "#475569",
      };

  const loadSweets = async () => {
    setLoading(true);
    const res = await api.get("/sweets");
    setSweets(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const purchase = async (id: number) => {
    await api.post(`/sweets/${id}/purchase`);
    loadSweets();
  };

  /* ADD SWEET */
  const addSweet = async () => {
    if (!name || !category || !price || !quantity) return;

    try {
      await api.post("/sweets", {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
      });
    } catch (e: any) {
      if (e.response?.status === 409) {
        alert("Sweet with this name already exists");
      }
    }

    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    loadSweets();
  };

  /* RESTOCK */
  const confirmRestock = async (id: number) => {
    const qty = Number(restockQty);
    if (!qty || qty <= 0) return;

    await api.post(`/sweets/${id}/restock`, { quantity: qty });

    setRestockId(null);
    setRestockQty("");
    loadSweets();
  };

  /* UPDATE SWEET */
  const updateSweet = async (id: number) => {
    await api.put(`/sweets/${id}`, {
      price: Number(editPrice),
      category: editCategory,
    });

    setEditId(null);
    setEditPrice("");
    setEditCategory("");
    loadSweets();
  };

  const deleteSweet = async (id: number) => {
    if (!confirm("Delete this sweet permanently?")) return;
    await api.delete(`/sweets/${id}`);
    loadSweets();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, padding: 32 }}>
      {/* HEADER */}
      <div style={header}>
        <h1>🍬 Sweet Shop</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={pill(theme)} onClick={() => setDark(!dark)}>
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button style={logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ADMIN ADD SWEET */}
      {user?.role === "ADMIN" && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ ...card(theme), maxWidth: 520, width: "100%" }}>
            <h2>➕ Add New Sweet</h2>
            <input style={input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input style={input} placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input style={input} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input style={input} type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <button style={addBtn} onClick={addSweet}>Add Sweet</button>
          </div>
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div style={grid}>
          {sweets.map((s) => (
            <div key={s.id} style={card(theme)}>
              <h2>{s.name}</h2>
              <p style={{ color: theme.muted }}>{s.category}</p>
              <p>₹{s.price}</p>
              <p><strong>Stock:</strong> {s.quantity}</p>

              <button
                style={purchaseBtn(s.quantity)}
                disabled={s.quantity === 0}
                onClick={() => purchase(s.id)}
              >
                {s.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>

              {user?.role === "ADMIN" && (
                <>
                  {editId === s.id ? (
                    <>
                      <input style={input} type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      <input style={input} value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                      <button style={restockBtn} onClick={() => updateSweet(s.id)}>Save</button>
                    </>
                  ) : (
                    <button
                      style={restockBtn}
                      onClick={() => {
                        setEditId(s.id);
                        setEditPrice(String(s.price));
                        setEditCategory(s.category);
                      }}
                    >
                      Update
                    </button>
                  )}

                  {restockId === s.id ? (
                    <>
                      <input style={input} type="number" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} />
                      <button style={restockBtn} onClick={() => confirmRestock(s.id)}>Confirm Restock</button>
                    </>
                  ) : (
                    <button style={restockBtn} onClick={() => setRestockId(s.id)}>Restock</button>
                  )}

                  <button style={deleteBtn} onClick={() => deleteSweet(s.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */
/* ---------- STYLES ---------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 20,
};

const card = (theme: any) => ({
  background: theme.card,
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
});

const input = {
  width: "100%",
  padding: "12px",
  marginTop: 8,
  borderRadius: 10,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white",
  fontSize: 14,
};

const pill = (theme: any) => ({
  padding: "8px 16px",
  borderRadius: 999,
  border: "none",
  background: theme.card,
  color: theme.text,
  fontWeight: 500,
  cursor: "pointer",
});

const addBtn = {
  marginTop: 12,
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const purchaseBtn = (qty: number) => ({
  marginTop: 12,
  width: "100%",
  padding: "10px",
  borderRadius: 10,
  border: "none",
  background: qty === 0 ? "#64748b" : "#ec4899",
  color: "white",
  fontWeight: 600,
  cursor: qty === 0 ? "not-allowed" : "pointer",
});

const restockBtn = {
  marginTop: 8,
  width: "100%",
  padding: "8px",
  borderRadius: 10,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtn = {
  marginTop: 6,
  width: "100%",
  padding: "8px",
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const logoutBtn = {
  padding: "8px 16px",
  borderRadius: 999,
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
