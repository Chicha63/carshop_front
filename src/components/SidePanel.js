import React, { useState } from "react";
import "./SidePanel.css";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";


const SidePanel = ({ onLogout }) => {
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate();
    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };
    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:8081/admin/logout');
            console.log('Logout successful:', response.data);
            localStorage.removeItem('token');
            onLogout(); // Call the logout handler passed from App
            navigate("/login");
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };
    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    return (
        <div className="side-panel">
            <button
                onMouseEnter={() => handleMouseEnter("main")}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate("/dashboard")}
            >
                Main
            </button>

            <button
                onMouseEnter={() => handleMouseEnter("goods")}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate("/signup")}
            >
                Goods
            </button>


            <button
                onMouseEnter={() => handleMouseEnter("Employees")}
                onMouseLeave={handleMouseLeave}
            >
                Clients
            </button>


            <button
                onMouseEnter={() => handleMouseEnter("deals")}
                onMouseLeave={handleMouseLeave}
            >
                Deals
            </button>

            <button
                onMouseEnter={() => handleMouseEnter("logout")}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    logout()}
                }
                >
                Logout
            </button>

        </div>
    );
};

export default SidePanel;
