import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "universal-cookie";

const Login = ({ setIsAuthenticated }) => {
    const cookies = new Cookies();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
    const navigate = useNavigate();

    const validateFields = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setError("Please enter both email and password.");
            return false;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }


        setError(""); // Clear errors if validation passes
        return true;
    };

    const handleLogin = async () => {
        if (!validateFields()) return;

        try {
            const response = await axios.post("http://localhost:8081/admin/signin", { email, password });

            console.log("Login successful:", response.data);
            setIsAuthenticated(true);
            cookies.set("token", response.data.jwt);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <div className="login-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="login-field">
                    <label htmlFor="password">Password:</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle visibility
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                {error && <p className="login-error">{error}</p>}
                <button className="login-button" onClick={handleLogin}>
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default Login;
