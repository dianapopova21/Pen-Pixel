import React from "react";
import "./CustomButton.scss";

const CustomButton = ({ title, onClick, color, hoverColor }) => {
    const buttonStyle = {
        backgroundColor: color || '#567C8D',
    };

    const buttonHoverStyle = {
        backgroundColor: hoverColor || '#2F4156',
    };

    return (
        <button
            type="button"
            className="button"
            onClick={onClick}
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
            {title}
        </button>
    );
};



export default CustomButton;
