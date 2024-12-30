import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";
import Cookies from "universal-cookie";

const AccountSettings = () => {
    const [employee, setEmployee] = useState({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const cookies = new Cookies();

    useEffect(() => {
        const fetchEmployee = async () => {

            try {
                const response = await axios.get("http://localhost:8081/api/authed/me", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status !== 200) {
                    setMessage(response.data.message);
                    throw new Error("Status: " + response.status + " " + response.data);
                }
                setEmployee({id:response.data.id, fullname: response.data.fullName, email: response.data.email, accessright:response.data.accessRight.id, password:password});
                console.log(response.data);
                console.log(employee);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };
        fetchEmployee();
    }, []);

    const handleUpdate = async () => {
        try {
            if (password !== confirmPassword) {
                setMessage("Passwords don't match!");
                throw new Error("Passwords do not match!");
            }
            const response = await axios.put(
                "http://localhost:8081/api/authed/employee",
                { ...employee},
                { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
            );
            if (response.status !== 200) {
                setMessage(response.data.message);
                throw new Error("Status: " + response.status + " " + response.data);
            }
            setMessage("Account updated successfully!");
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    return (
        <div className="settings-container">
            <h2>Account Settings</h2>

            <div className="settings-field">
                <label htmlFor="fullName">Full Name:</label>
                <input
                    type="text"
                    id="fullName"
                    value={employee.fullname}
                    onChange={(e) => setEmployee({ ...employee, fullname: e.target.value })}
                />
            </div>

            <div className="settings-field">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={employee.email}
                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                />
            </div>

            <div className="settings-field">
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setEmployee({ ...employee, password: e.target.value }); console.log(employee)}}
                />
            </div>

            <div className="settings-field">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="update-button" onClick={handleUpdate}>
                Update Account
            </button>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
};

export default AccountSettings;
