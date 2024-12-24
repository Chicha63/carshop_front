import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from "mdb-react-ui-kit";

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Validate inputs
            if (!email || !password) {
                setError("Please enter both email and password.");
                return;
            }

            // Make login request
            const response = await axios.post("http://localhost:8081/admin/signin", { email, password });

            // On successful login
            console.log("Login successful:", response.data);
            localStorage.setItem("token", response.data.jwt);
            setIsAuthenticated(true); // Notify parent component
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            // Handle login errors
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: "500px", height: "auto" }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Login</h2>
                    <MDBInput
                        wrapperClass="mb-4"
                        placeholder="Email address"
                        id="email"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <MDBInput
                        wrapperClass="mb-4"
                        placeholder="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-danger text-center">{error}</p>} {/* Render error message */}
                    <MDBBtn
                        className="mb-4"
                        style={{ width: "100%" }}
                        onClick={handleLogin}
                        color="primary"
                    >
                        Sign In
                    </MDBBtn>
                </MDBContainer>
            </div>
        </div>
    );
};

export default Login;
