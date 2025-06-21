import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import "./PasswordInput.scss";

const PasswordInput = ({ value, onChange}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="password-input">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={value}
                onChange={onChange}
                required
            />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
                {showPassword ? <HiOutlineEyeSlash  /> : <HiOutlineEye />}
            </button>
        </div>
    );
};

export default PasswordInput;
