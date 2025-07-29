import express from "express";
import dotenv from "dotenv";
import SQL from "./config/db.js";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function initDB() {
  try {
    await SQL`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}


app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await SQL`SELECT * FROM transactions`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await SQL`SELECT * FROM transactions`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Insert the transaction into the database
    const transaction = await SQL`INSERT INTO transactions (user_id, title, amount, category)
              VALUES (${user_id}, ${title}, ${amount}, ${category})
              RETURNING *`;

    res.status(201).json({ message: "Transaction created successfully.", transaction: transaction[0] });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
