import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import BlogGrid from "../../components/BlogGrid/BlogGrid";
import Pagination from "../../components/Pagination/Pagination";
import usePaginatedBlogs from "../../hooks/usePaginatedBlogs";
import "./FavoriteBlogsPage.scss";
import sadFace from "../../assets/sad-face.png";

const FavoriteBlogsPage = () => {
    const { user } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (user) {
                    const res = await fetch(`http://localhost:5000/api/favorites/${user.id}`);
                    const data = await res.json();
                    setBlogs(data);
                } else {
                    const localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                    console.log("localFavourites:", localFavorites);
                    if (localFavorites.length === 0) {
                        setBlogs([]);
                        return;
                    }

                    const res = await fetch("http://localhost:5000/api/blogs/byIds", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ids: localFavorites }),
                    });

                    const data = await res.json();
                    console.log(data);
                    setBlogs(data);
                }
            } catch (err) {
                console.error("Error loading featured blogs:", err);
            }
        };

        fetchFavorites();
    }, [user]);

    const {
        currentBlogs,
        currentPage,
        totalPages,
        goToPage,
    } = usePaginatedBlogs(blogs, 6);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="favourite-page">
            {blogs.length > 0 ? (
                <div>
                    <h1>My favorite blogs</h1>
                    <BlogGrid blogs={currentBlogs} />

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    )}
                </div>
            ) : (
                <div className="favourite-page__empty">
                    <p>No favorite blogs yet</p>
                    <img src={sadFace} alt="sad emoji" />
                </div>
            )}
        </div>
    );
};

export default FavoriteBlogsPage;
