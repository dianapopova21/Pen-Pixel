const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Подключение к MySQL
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultAvatar = "https://res.cloudinary.com/diqtvi9m5/image/upload/v1740498729/default-avatar_tlxou0.jpg";

        const query = "INSERT INTO users (username, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [username, email, hashedPassword, role, defaultAvatar], (err, results) => {
            if (err) {
                console.error("Error adding user to DB:", err);
                return res.status(500).json({ error: "Server error" });
            }
            res.status(201).json({ message: "User registered" });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

// Check if the user exists in MySQL
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(404).json({ error: "User not found" });

        const user = users[0];

// Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

// Create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        console.log("Server response:", { token, user }); // Check that we are sending

// Sending correct data to the client
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/update-username", authMiddleware, async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.id;

        if (!username) {
            return res.status(400).json({ error: "Name cannot be empty" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ username: updatedUser.username });
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ error: "Error updating name" });
    }
});

module.exports = router;
