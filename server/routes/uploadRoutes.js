const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");
const connection = require("../db");

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "avatars",
        format: async () => "jpg",
        public_id: () => Date.now().toString(),
    },
});
const upload = multer({ storage });

router.post("/upload-avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File not uploaded" });

        const userId = req.user.id;
        const avatarUrl = req.file.path;

        const query = "UPDATE users SET avatar = ? WHERE id = ?";
        connection.query(query, [avatarUrl, userId], (err, results) => {
            if (err) {
                console.error("Avatar update error:", err);
                return res.status(500).json({ error: "Avatar update error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ avatar: avatarUrl });
        });

    } catch (error) {
        console.error("Avatar loading error:", error);
        res.status(500).json({ error: "Avatar loading error" });
    }
});

// Handler for loading blog images
router.post("/upload-image", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "File not uploaded" });

        // Link to image after upload
        const imageUrl = req.file.path;

        // Returning the link to the image
        res.json({ imageUrl });
    } catch (error) {
        console.error("Error loading image:", error);
        res.status(500).json({ error: "Error loading image" });
    }
});

module.exports = router;
