const mysql = require("mysql2");
require("dotenv").config(); // Для работы с переменными окружения

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_blogs",
});

// Connecting to the database
connection.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

module.exports = connection;
