import React from "react";
import { Link } from "react-router-dom";
import { PiStarLight, PiStarFill } from "react-icons/pi";
import { CiTrash } from "react-icons/ci";
import "./BlogInfo.scss";

const BlogInfo = ({
                      blog,
                      isFavorite,
                      onToggleFavorite,
                      onDelete,
                      isOwner
                  }) => {
    return (
        <div className="blog-page">
            <img className="blog-image" src={blog.image} alt={blog.title} />
            <h1 className="blog-title">
                {blog.title}
                {isFavorite ? (
                    <PiStarFill
                        className="favorite-icon active"
                        onClick={onToggleFavorite}
                    />
                ) : (
                    <PiStarLight
                        className="favorite-icon"
                        onClick={onToggleFavorite}
                    />
                )}
            </h1>
            <Link to={`/authors/${blog.author_id}`} className="blog-author-link">
                <p className="blog-author">Author: {blog.authorName}</p>
            </Link>

            <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            {isOwner && (
                <button className="delete-blog-button" onClick={onDelete}>
                    <CiTrash />
                </button>
            )}
        </div>
    );
};

export default BlogInfo;
