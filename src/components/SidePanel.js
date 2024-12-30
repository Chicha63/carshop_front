import React, { useState, useEffect } from "react";
import "./SidePanel.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const SidePanel = ({ onLogout }) => {
    const [hoveredButton, setHoveredButton] = useState(null);
    const [accessright, setAccessright] = useState(null);
    const [employee, setEmployee] = useState({});
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const cookies = new Cookies();
    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };
    const closeAlert = () => {
        setIsAlertVisible(false);
        setAlertMessage("");
    };


    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setEmployee({id:response.data.id, fullname: response.data.fullName, email: response.data.email, accessright:response.data.accessRight.id, password:""});
                console.log(response.data);
                console.log(employee);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        }

        if (employee.accessright) {
            setAccessright(employee.accessright); // Parse as an integer
        } else {
            setAccessright(3);
        }
    }, []);

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    const logout = async () => {
        try {
            const response = await axios.post("http://localhost:8081/admin/logout", {}, {headers: { Authorization: `Bearer ${cookies.get("token")}` },}).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            console.log("Logout successful:", response.data);
            localStorage.removeItem("token");
            onLogout(); // Call the logout handler passed from App
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="side-panel">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
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
                onClick={() => navigate("/goods")}
            >
                Goods
            </button>

            <button
                onMouseEnter={() => handleMouseEnter("models")}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate("/models")}
            >
                Models
            </button>

            {/*<button*/}
            {/*    onMouseEnter={() => handleMouseEnter("clients")}*/}
            {/*    onMouseLeave={handleMouseLeave}*/}
            {/*    onClick={() => navigate("/clients")}*/}
            {/*>*/}
            {/*    Clients*/}
            {/*</button>*/}

            {/*<button*/}
            {/*    onMouseEnter={() => handleMouseEnter("deals")}*/}
            {/*    onMouseLeave={handleMouseLeave}*/}
            {/*    onClick={() => navigate("/deals")}*/}
            {/*>*/}
            {/*    Deals*/}
            {/*</button>*/}

            {/* Conditional rendering for Signup button */}
            {accessright >= 1 && (
                <button
                    onMouseEnter={() => handleMouseEnter("signup")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate("/signup")}
                >
                    Signup
                </button>
            )}

            <button
                onMouseEnter={() => handleMouseEnter("logout")}
                onMouseLeave={handleMouseLeave}
                onClick={() => logout()}
            >
                Logout
            </button>
        </div>
    );
};

export default SidePanel;
