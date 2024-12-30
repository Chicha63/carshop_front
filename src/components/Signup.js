import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import CustomAlert from "./CustomAlert";

function Signup() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessright, setAccessright] = useState(1);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };
    const closeAlert = () => {
        setIsAlertVisible(false);
        setAlertMessage("");
    };


    const handleSignup = async () => {
        try {
            if (!fullname || !email || !password || !confirmPassword) {
                setError('Please fill in all fields.');
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const response = await axios.post('http://localhost:8081/admin/signup', {
                fullname,
                accessright,
                email,
                password,
            }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    return (
        <div className="signup-container">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                {error && <p className="signup-error">{error}</p>}
                <div className="signup-field">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        placeholder="Enter employee's full name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter employee's email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter employee's password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm employee's password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="accessright">Access Right:</label>
                    <select
                        id="accessright"
                        value={accessright}
                        onChange={(e) => setAccessright(e.target.value)}
                    >
                        <option value="2">Manager</option>
                        <option value="1">Admin</option>
                        <option value="3">Employee</option>
                    </select>
                </div>
                <button className="signup-button" onClick={handleSignup}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Signup;
