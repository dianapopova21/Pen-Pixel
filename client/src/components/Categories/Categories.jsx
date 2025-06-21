import React from "react";
import "./Categories.scss";

const categories = [
    "All",
    "Beauty",
    "Health",
    "Travelling",
    "Technologies",
    "Food",
    "Sport",
    "Media",
];

const Categories = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="categories-scroll-wrapper">
            {categories.map((category) => (
                <span
                    key={category}
                    className={`category ${activeCategory === category ? "active" : ""}`}
                    onClick={() => onCategoryChange(category)}
                >
          {category}
        </span>
            ))}
        </div>
    );
};

export default Categories;
