const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// PODŁĄCZENIE DO SUPABASE
const supabase = createClient(
  "https://qwxvgmwjouditaveebha.supabase.co",
  "sb_publishable_rUZAD1g95pMUU6YIvfknLA_YeiOcUvp",
);

// SERWOWANIE FRONTENDU (Pliki z folderu /client)
app.use(express.static(path.join(__dirname, "../client")));

// API: Pobieranie ofert dla danego miasta
app.get("/api/offers", async (req, res) => {
  const { city } = req.query;
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("city", city);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// API: Zapisywanie rezerwacji
app.post("/api/bookings", async (req, res) => {
  const { data, error } = await supabase.from("bookings").insert([req.body]);

  if (error) return res.status(400).json(error);
  res.json({ success: true, data });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Serwer zapierdala na http://localhost:${PORT}`),
);
