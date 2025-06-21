import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.scss";

const BlogCard = ({ id, imageSrc, title, author, createdAt }) => {

    const formattedDate = new Date(createdAt).toLocaleDateString();

    return (
        <Link to={`/blogs/${id}`} className="blog-card-link">
            <div className="blog-card">
                <div className="image-container">
                    <img src={imageSrc} alt="blog" />
                </div>
                <div className="blog-card-content">
                    <h3 className="blog-card-title">{title}</h3>
                    <p className="blog-card-author">By {author}</p>
                    <p className="blog-card-date">{formattedDate}</p>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
