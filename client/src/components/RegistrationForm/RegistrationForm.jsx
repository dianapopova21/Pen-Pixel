import { useState, useContext } from 'react';
import "./RegistrationForm.scss";
import Button from "../CustomButton/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../PasswordInput/PasswordInput";
import Notification from "../Notification/Notification";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const RegistrationForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'reader'
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Enter username";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Enter email";
        } else if (formData.email.length > 320) {
            newErrors.email = "Email must be no more than 320 characters";
        } else if (/[а-яА-ЯёЁ]/.test(formData.email)) {
            newErrors.email = "Email must not contain Cyrillic characters";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Enter password";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/[A-Za-z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one letter";
        } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/~`[\]\\;]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");

        if (!validateForm()) return;

        try {
            const response = await axios.post("http://localhost:5000/api/register", formData);

            setSuccessMessage(response.data.message);

            login(response.data.user, response.data.token);

            setTimeout(() => {
                navigate("/profile");
            }, 1000);

        } catch (error) {
            setErrors({ email: error.response?.data?.message || "Registration error" });
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Sign up</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                {errors.username && <p className="error">{errors.username}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {errors.email && <p className="error">{errors.email}</p>}

                <PasswordInput value={formData.password} onChange={handleChange}/>
                {errors.password && <p className="error">{errors.password}</p>}

                <Button title="Sign up" onClick={handleSubmit} />
                <p>Already have an account? <Link to="/login"><i>Log in</i></Link></p>
            </form>
            {successMessage && <Notification message={successMessage} onClose={() => setSuccessMessage("")} />}
        </div>
    );
};

export default RegistrationForm;
