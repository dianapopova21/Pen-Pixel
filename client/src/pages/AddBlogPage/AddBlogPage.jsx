import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBlogPage.scss";
import TextEditor from "../../components/TextEditor/TextEditor";
import Button from "../../components/CustomButton/CustomButton";
import { AuthContext } from "../../context/AuthContext";

const AddBlogPage = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [keywords, setKeywords] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [errors, setErrors] = useState({});

    const categories = ["Beauty", "Health", "Travelling", "Technologies", "Food", "Sport", "Media"];

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!title.trim()) {
            newErrors.title = "Enter a title";
        } else if (title.length > 100) {
            newErrors.title = "Title must be no more than 100 characters";
        }

        if (!image) newErrors.image = "Select an image";

        if (!category) newErrors.category = "Select a category";
        const plainText = content.replace(/<[^>]*>/g, "").trim();

        if (!plainText) {
            newErrors.content = "Enter content";
        } else if (plainText.length < 300) {
            newErrors.content = "Content must be at least 300 characters";
        } else if (plainText.length > 10000) {
            newErrors.content = "Content must be no more than 10,000 characters";
        }

        if (!keywords.trim()) newErrors.keywords = "Enter keywords";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/api/upload-image", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });

            const data = await response.json();

            if (data.imageUrl) {
                const blogData = {
                    title,
                    category,
                    content,
                    keywords,
                    image: data.imageUrl,
                };

                const blogResponse = await fetch("http://localhost:5000/api/blogs", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(blogData),
                });

                const blogDataResult = await blogResponse.json();

                if (blogResponse.ok) {
                    setSuccessMessage("Blog successfully added!");
                    setTimeout(() => navigate("/"), 1500);
                } else {
                    setErrors({ global: blogDataResult.message || "Error adding blog" });
                }
            } else {
                setErrors({ global: "Error loading image" });
            }
        } catch (error) {
            setErrors({ global: "The server is unavailable. Try again later." });
        }
    };

    return (
        <div className="blog-form-container">
            <h2>Create your blog</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        className="blog-input"
                        maxLength={100}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <small className="char-counter">{title.length}/100</small>
                    {errors.title && <p className="error-message">{errors.title}</p>}
                </label>


                <label>
                    Upload image:
                    <input
                        type="file"
                        className="blog-input"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {errors.image && <p className="error-message">{errors.image}</p>}
                </label>

                <label>
                    Category:
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled>Select category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="error-message">{errors.category}</p>}
                </label>

                <TextEditor setContent={setContent} />
                {errors.content && <p className="error-message">{errors.content}</p>}

                <label>
                    Key words (separate by commas):
                    <input
                        type="text"
                        className="blog-input"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                    {errors.keywords && <p className="error-message">{errors.keywords}</p>}
                </label>

                <Button title="Add blog" onClick={handleSubmit} />
            </form>

            {errors.global && <p className="error-message">{errors.global}</p>}

            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default AddBlogPage;
