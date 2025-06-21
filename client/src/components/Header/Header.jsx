import React, { useContext } from 'react';
import './Header.scss';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import img from "./../../assets/icons/logo-pen.png";
import { CiUser, CiStar, CiCirclePlus   } from "react-icons/ci";
import { PiBooksThin } from "react-icons/pi";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
    const { user } = useContext(AuthContext);
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={img} alt="Логотип" className="logo_icon" />
                    <Link to="/"><p className="logo">Pen & Pixel</p></Link>
                </div>
                <SearchBar/>
                <div className="icons">
                    <Link to={user ? `/addBlog` : "/login"}><CiCirclePlus /></Link>
                    <Link to="/favorites">
                        <CiStar />
                    </Link>
                    <Link to={user ? `/authors/${user.id}` : "/login"}><PiBooksThin /></Link>
                    <Link to={user ? "/profile" : "/login"} className="profile-link">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Аватар" className="profile-avatar-sm" />
                        ) : (
                            <CiUser />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );

};

export default Header;
