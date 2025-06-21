import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header/Header";
import RegisterPage from "./pages/RegistrationPage/RegistrationPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AddBlogPage from "./pages/AddBlogPage/AddBlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage/BlogDetailsPage";
import AuthorBlogsPage from "./pages/AuthorBlogsPage/AuthorBlogsPage";
import FavouriteBlogsPage from "./pages/FavoriteBlogsPage/FavoriteBlogsPage";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";
import "./App.scss";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:5000")
            .then((response) => {
                setMessage(response.data);
            })
            .catch((error) => {
                console.error("Request error:", error);
            });
    }, []);

    return (
        <div className="app-background">
            <div className="app-container">
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/addBlog" element={<AddBlogPage />} />
                        <Route path="/blogs/:id" element={<BlogDetailsPage />} />
                        <Route path="/authors/:id" element={<AuthorBlogsPage />} />
                        <Route path="/favorites" element={<FavouriteBlogsPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}

export default App;
