import React from "react";
import "./BlogGrid.scss";
import BlogCard from "../BlogCard/BlogCard";

const BlogGrid = ({ blogs }) => {
    return (
        <div className="blog-grid-container">
            <div className="blog-grid">
                {blogs.map((blog) => (
                    <BlogCard
                        key={blog.id}
                        id={blog.id}
                        imageSrc={blog.image}
                        title={blog.title}
                        author={blog.authorName}
                        createdAt={blog.created_at}
                    />
                ))}
            </div>
        </div>
    );
};

export default BlogGrid;
