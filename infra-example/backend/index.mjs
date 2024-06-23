import express from "express";
import pg from "pg";
import cors from "cors";
import "dotenv/config";
const app = express();

app.use(cors());
app.use(express.json());

const { Client } = pg;
const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
});

await client.connect();

app.get("/api", async (req, res) => {
  const compras = await client.query("SELECT * FROM purchases");
  res.json(compras.rows);
});

app.get("/api/editor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT * FROM purchases WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Purchase not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving purchase");
  }
});

app.post("/api/editor/:id", async (req, res) => {
  const { id } = req.params;
  const { purchase_name, value, purchase_date } = req.body;
  try {
    const result = await client.query(
      "UPDATE purchases SET purchase_name = $1, value = $2, purchase_date = $3 WHERE id = $4 RETURNING *",
      [purchase_name, value, purchase_date, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Purchase not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating purchase");
  }
});

app.post("/api/purchases", async (req, res) => {
  const { purchase_name, value, purchase_date } = req.body;

  // Validação básica para verificar se todos os dados necessários estão presentes
  if (!purchase_name || !value || !purchase_date) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const result = await client.query(
      "INSERT INTO purchases (purchase_name, value, purchase_date) VALUES ($1, $2, $3) RETURNING *",
      [purchase_name, value, purchase_date]
    );
    // Retorna a compra que foi inserida no banco de dados
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting purchase:", error);
    res.status(500).send("Failed to create purchase.");
  }
});

app.listen(80, () => console.log("Server started at port 80"));
