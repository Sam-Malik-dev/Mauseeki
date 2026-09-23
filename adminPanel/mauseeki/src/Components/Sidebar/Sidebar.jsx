import React, { useState } from "react";
import {
    FaHome,
    FaMusic,
    FaUsers,
    FaMicrophone,
    FaCompactDisc,
    FaSignOutAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {

    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger */}
            <button
                className="hamburger-button"
                onClick={() => setIsOpen(true)}
            >
                <FaBars />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeMenu}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

                {/* Close Button */}
                <button
                    className="sidebar-close"
                    onClick={closeMenu}
                >
                    <FaTimes />
                </button>

                <div className="sidebar-logo">
                    <h2>Mauseeki</h2>
                    <span>ADMIN</span>
                </div>

                <nav className="sidebar-menu">

                    <Link
                        to="/"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaHome />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/songs"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaMusic />
                        <span>Songs</span>
                    </Link>

                    <Link
                        to="/albums"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaCompactDisc />
                        <span>Albums</span>
                    </Link>

                    <Link
                        to="/artists"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaMicrophone />
                        <span>Artists</span>
                    </Link>

                    <Link
                        to="/users"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaUsers />
                        <span>Users</span>
                    </Link>
                    <Link
                        to="/messages"
                        className="sidebar-link"
                        onClick={closeMenu}
                    >
                        <FaUsers />
                        <span>Messages</span>
                    </Link>

                </nav>

                <div className="sidebar-bottom">

                    <button className="logout-button">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;