import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./AuthorBlogsPage.scss";
import BlogGrid from "../../components/BlogGrid/BlogGrid";
import usePaginatedBlogs from "../../hooks/usePaginatedBlogs";
import Pagination from "../../components/Pagination/Pagination";
import sadFace from "../../assets/sad-face.png";

const AuthorBlogsPage = () => {
    const { id } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [authorName, setAuthorName] = useState("");
    const [authorAvatar, setAuthorAvatar] = useState("");

    const {
        currentBlogs,
        currentPage,
        totalPages,
        goToPage,
    } = usePaginatedBlogs(blogs, 6);

    useEffect(() => {
        const fetchBlogsByAuthor = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/authors/${id}`);
                const data = await res.json();
                setBlogs(data);
                if (data.length > 0) {
                    setAuthorName(data[0].authorName);
                    setAuthorAvatar(data[0].authorAvatar);
                }
            } catch (err) {
                console.error("Error loading author data:", err);
            }
        };

        fetchBlogsByAuthor();
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    return (
        <div className="author-page">
            {blogs.length > 0 ? (
                <>
                    <div className="author-header">
                        {authorAvatar && (
                            <img
                                className="author-avatar"
                                src={authorAvatar}
                                alt={authorName}
                            />
                        )}
                        <h1>{authorName}'s blogs</h1>
                    </div>

                    <BlogGrid blogs={currentBlogs} />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                        />
                    )}
                </>
            ) : (
                <div className="favourite-page__empty">
                    <p>No blogs yet</p>
                    <img src={sadFace} alt="sad emoji" />
                </div>
            )}
        </div>
    );
};

export default AuthorBlogsPage;
