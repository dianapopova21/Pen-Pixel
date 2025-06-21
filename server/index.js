const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parsing JSON in Requests

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the headers

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Authorization failed' });
        }

        req.userId = decoded.id; // Write the user id from the token
        next();
    });
};


app.post("/api/register", async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const checkEmailQuery = "SELECT email FROM users WHERE email = ?";
        connection.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "This email is already taken" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultAvatar = "https://res.cloudinary.com/diqtvi9m5/image/upload/v1740498729/default-avatar_tlxou0.jpg";
            const insertQuery = "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)";

            connection.query(insertQuery, [username, email, hashedPassword, defaultAvatar], (err, results) => {
                if (err) {
                    console.error("Error adding user:", err);
                    return res.status(500).json({ message: "Server error" });
                }

                // Create a token for a new user
                const userId = results.insertId;
                const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

                // Sending the token and user data
                res.status(201).json({
                    message: "Account created successfully!",
                    token,
                    user: {
                        id: userId,
                        username,
                        email,
                        avatar: defaultAvatar
                    }
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Error while querying the database:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar
            }
        });
    });
});

app.get("/api/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Getting the token from the headers

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decoding the token
        const query = "SELECT id, username, email, avatar FROM users WHERE id = ?";

        connection.query(query, [decoded.id], (err, results) => {
            if (err) {
                console.error("Request error:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(results[0]); // Sending user data
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.get('/api/blogs/search', (req, res) => {
    const query = req.query.query?.toLowerCase().trim();

    if (!query) {
        return res.status(400).json({ message: 'No search query' });
    }

    const sql = `
        SELECT DISTINCT b.id, b.title, b.image, b.created_at, u.username AS authorName
        FROM blogs b
        JOIN users u ON b.author_id = u.id
        LEFT JOIN blog_keywords bk ON b.id = bk.blog_id
        WHERE LOWER(b.title) LIKE ? OR LOWER(bk.keyword) LIKE ?
    `;

    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Error while searching:', err);
            return res.status(500).json({ message: 'Inner server error' });
        }

        res.json(results);
    });
});

// Adding a new blog
app.post("/api/blogs", (req, res) => {
    const { title, category, content, keywords, image } = req.body;

    if (!title || !category || !content || !keywords || !image) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const author_id = decoded.id;

        const blogQuery = "INSERT INTO blogs (title, category, content, keywords, image, author_id) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(blogQuery, [title, category, content, keywords, image, author_id], (err, results) => {
            if (err) {
                console.error("Error adding blog:", err);
                return res.status(500).json({ message: "Error adding blog" });
            }

            const blogId = results.insertId;

            // Spliting keywords on commas and clear spaces
            const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k !== "");

            if (keywordList.length === 0) {
                return res.status(201).json({ message: "Blog added without keywords" });
            }

            // Preparing an array for multiple insertion
            const keywordValues = keywordList.map(k => [k, blogId]);

            const keywordQuery = "INSERT INTO blog_keywords (keyword, blog_id) VALUES ?";
            connection.query(keywordQuery, [keywordValues], (kwErr) => {
                if (kwErr) {
                    console.error("Error adding keywords:", kwErr);
                    return res.status(500).json({ message: "Blog added but keywords not saved" });
                }

                res.status(201).json({ message: "Blog successfully added" });
            });
        });
    } catch (error) {
        console.error("Error processing token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
});

// Getting blogs to display
app.get("/api/blogs", (req, res) => {
    const category = req.query.category;

    let query = `
        SELECT blogs.*, users.username AS authorName 
        FROM blogs 
        JOIN users ON blogs.author_id = users.id
    `;

    const params = [];

    if (category && category !== "All") {
        query += " WHERE category = ?";
        params.push(category);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error("Error retrieving blogs:", err);
            return res.status(500).json({ message: "Server error" });
        }

        res.json(results);
    });
});

app.get("/api/blogs/:id", (req, res) => {
    const blogId = req.params.id;

    const query = `
        SELECT blogs.*, users.username AS authorName
        FROM blogs
        JOIN users ON blogs.author_id = users.id
        WHERE blogs.id = ?
    `;

    connection.query(query, [blogId], (err, results) => {
        if (err) {
            console.error("Error retrieving blog:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(results[0]);
    });
});

app.delete('/api/blogs/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { userId } = req; // user id from token

    // Check if the current user is the author of the blog
    const sql = 'SELECT author_id FROM blogs WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting blog' });

        if (result.length === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const blog = result[0];
        if (blog.author_id !== userId) {
            return res.status(403).json({ message: 'You can\'t delete this blog' });
        }

        // Deleting a blog
        const deleteSql = 'DELETE FROM blogs WHERE id = ?';
        connection.query(deleteSql, [id], (err) => {
            if (err) return res.status(500).json({ message: 'Error deleting blog' });
            res.status(200).json({ message: 'Blog successfully deleted' });
        });
    });
});

app.get("/api/authors/:id", (req, res) => {
    const authorId = req.params.id;

    const query = `
        SELECT blogs.*, users.username AS authorName, users.avatar AS authorAvatar
        FROM blogs
        JOIN users ON blogs.author_id = users.id
        WHERE blogs.author_id = ?
    `;

    connection.query(query, [authorId], (err, results) => {
        if (err) {
            console.error("Error getting author's blogs:", err);
            return res.status(500).json({ message: "Server error" });
        }

        res.json(results);
    });
});

app.put("/api/update-username", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Name cannot be empty" });
        }

        const query = "UPDATE users SET username = ? WHERE id = ?";
        connection.query(query, [username, decoded.id], (err, results) => {
            if (err) {
                console.error("Error updating name:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ message: "Username updated", username });
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.get("/api/favorites", (req, res) => {
    const { userId } = req.query;
    connection.query("SELECT * FROM favorites WHERE user_id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });
        res.json(results);
    });
});

app.post("/api/favorites", (req, res) => {
    const { userId, blogId } = req.body;
    connection.query("INSERT INTO favorites (user_id, blog_id) VALUES (?, ?)", [userId, blogId], err => {
        if (err) return res.status(500).json({ message: "Error adding" });
        res.status(201).json({ message: "Added to favorites" });
    });
});

app.delete("/api/favorites", (req, res) => {
    const { userId, blogId } = req.body;
    connection.query("DELETE FROM favorites WHERE user_id = ? AND blog_id = ?", [userId, blogId], err => {
        if (err) return res.status(500).json({ message: "Error deleting" });
        res.status(200).json({ message: "Removed from favorites" });
    });
});

app.get("/api/favorites/:userId", (req, res) => {
    const userId = req.params.userId;  // Get userId from route parameter

    const query = `
        SELECT blogs.*, users.username AS authorName
        FROM favorites
        JOIN blogs ON favorites.blog_id = blogs.id
        JOIN users ON blogs.author_id = users.id
        WHERE favorites.user_id = ?
    `;

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ message: "Error retrieving featured blogs" });
        }

        res.json(results);
    });
});

app.post("/api/blogs/byIds", (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Invalid ID list" });
    }

    const placeholders = ids.map(() => "?").join(",");
    const query = `
        SELECT blogs.*, users.username AS authorName
        FROM blogs
        JOIN users ON blogs.author_id = users.id
        WHERE blogs.id IN (${placeholders})
    `;

    connection.query(query, ids, (err, results) => {
        if (err) {
            console.error("Error getting blogs by ID:", err);
            return res.status(500).json({ message: "Error getting blogs" });
        }

        res.json(results);
    });
});


// Connecting the avatar loading route
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

// Starting the server
app.listen(PORT, () => {
    console.log(`✅ The server is running on http://localhost:${PORT}`);
});

// Checking server operation
app.get("/", (req, res) => {
    res.send("The server is running!");
});
