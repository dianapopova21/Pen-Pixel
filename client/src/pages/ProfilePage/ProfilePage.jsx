import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { CiCamera, CiEdit, CiFloppyDisk } from "react-icons/ci";
import Button from "../../components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.scss";

const ProfilePage = () => {
    const { user, logout, updateAvatar } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(user?.avatar);
    const [username, setUsername] = useState(user?.username || "No name");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.avatar) {
                setAvatar(response.data.avatar);
                updateAvatar(response.data.avatar);
            }
        } catch (error) {
            console.error("Avatar loading error:", error);
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const saveUsername = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/update-username",
                { username },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.username) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            saveUsername();
        }
    };

    return user ? (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-avatar-container" onClick={handleAvatarClick}>
                    <div className="profile-avatar">
                        <img src={avatar} alt="Profile" />
                        <div className="upload-overlay">
                            <CiCamera className="upload-icon" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div className="profile-info">
                    <div className="profile-header">
                        {isEditing ? (
                            <input
                                type="text"
                                className="profile-username-input"
                                value={username}
                                onChange={handleUsernameChange}
                                onBlur={saveUsername}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                        ) : (
                            <h3 className="profile-username">{username}</h3>
                        )}
                        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? <CiFloppyDisk className="edit-icon" /> : <CiEdit className="edit-icon" />}
                        </button>
                    </div>
                    <p className="profile-email">{user.email}</p>
                </div>
                <Button title="Logout" color="#ff3d3d" hoverColor="#c42b2b"
                    onClick={() => {
                    logout();
                    navigate("/");
                }} />
            </div>
        </div>
    ) : null;
};

export default ProfilePage;
