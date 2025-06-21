import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.scss";
import Button from "../CustomButton/CustomButton";
import PasswordInput from "../PasswordInput/PasswordInput";
import Notification from "../Notification/Notification";
import { AuthContext } from "../../context/AuthContext";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
        setErrors({ ...errors, [name]: "" }); // Reset input error
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Enter email";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Invalid email";
            }
        }

        if (!formData.password.trim()) {
            newErrors.password = "Enter your password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setSuccessMessage("");

        if (!validateForm()) return;

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                const { token, user } = data;

                if (!user || !user.username || !user.avatar) {
                    setErrors({ email: "Error: server did not return a name or avatar." });
                    return;
                }

                localStorage.setItem("token", token);
                login(user, token);
                navigate("/");
            } else {
                setErrors({ email: data.message || "Invalid email or password" });
            }
        } catch (error) {
            console.error("Error:", error);
            setErrors({ email: "Error logging in. Try again." });
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Log in</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <PasswordInput value={formData.password} onChange={handleChange} />
                {errors.password && <p className="error">{errors.password}</p>}

                <label className="remember-me">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    Remember me
                </label>

                <Button title="Login" onClick={handleSubmit} />
                <p>Don't have an account yet? <Link to="/register"><i>Sign up</i></Link></p>
            </form>

            {successMessage && (
                <Notification message={successMessage} onClose={() => setSuccessMessage("")} />
            )}
        </div>
    );
};

export default LoginForm;