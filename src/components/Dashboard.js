import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const Dashboard = () => {
    const [employee, setEmployee] = useState({});
    const [role, setRole] = useState("Null");
    const [deals, setDeals] = useState([]);
    const [acceptedDeals, setAcceptedDeals] = useState([]); // New state for accepted deals
    const [stats, setStats] = useState({ totalDeals: 0, completedDeals: 0 });
    const history = useNavigate();
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
                const response = await axios.get("http://localhost:8081/api/authed/me", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status !== 200) {
                    showAlert("Status: " + response.status + " " + response.data);
                    throw new Error("Status: " + response.status + " " + response.data);
                }
                setEmployee(response.data);
                setRole(response.data.accessRight.name);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        const fetchDeals = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/authed/deals:pending", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status !== 200) {
                    showAlert("Status: " + response.status + " " + response.data);
                    throw new Error("Status: " + response.status + " " + response.data);
                }
                setDeals(response.data);
            } catch (error) {
                console.error("Error fetching deals:", error);
            }
        };

        const fetchAcceptedDeals = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/authed/deals:accepted", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status !== 200) {
                    showAlert("Status: " + response.status + " " + response.data);
                    throw new Error("Status: " + response.status + " " + response.data);
                }
                setAcceptedDeals(response.data);
            } catch (error) {
                console.error("Error fetching accepted deals:", error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/authed/getstats", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status !== 200) {
                    showAlert("Status: " + response.status + " " + response.data);
                    throw new Error("Status: " + response.status + " " + response.data);
                }
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching accepted deals:", error);
            }
        }

        fetchStats();
        fetchEmployee();
        fetchDeals();
        fetchAcceptedDeals();
    }, []);

    const handleDealClick = (id) => {
        history(`/deal/${id}`);
    };

    return (
        <div className="dashboard-container">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <div className="employee-panel">
                <h2>Welcome, {employee.fullName || "Employee"}! Your role: {role} </h2>
                <button
                    onClick={() => history("/account")}
                    className="settings-button"
                >
                    Account Settings
                </button>
            </div>

            <div className="deals-panel">
                <h3>Available Deals</h3>
                {deals.length > 0 ? (
                    <ul className="deals-list">
                        {deals.map((deal) => (
                            <li
                                key={deal.id}
                                className="deal-item"
                                onClick={() => handleDealClick(deal.id)}
                            >
                                <strong>Deal ID:</strong> {deal.id} <br />
                                <strong>Client:</strong> {deal.client.fullName} <br />
                                <strong>Status:</strong> {deal.status.name} <br />
                                <strong>Date:</strong>{" "}
                                {new Date(deal.date).toLocaleString()} <br />
                                <strong>Price:</strong> ${deal.finalPrice.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No deals available for processing.</p>
                )}
            </div>

            <div className="accepted-deals-panel">
                <h3>Your Accepted Deals</h3>
                {acceptedDeals.length > 0 ? (
                    <ul className="deals-list">
                        {acceptedDeals.map((deal) => (
                            <li
                                key={deal.id}
                                className="deal-item"
                                onClick={() => handleDealClick(deal.id)}
                            >
                                <strong>Deal ID:</strong> {deal.id} <br />
                                <strong>Client:</strong> {deal.client.fullName} <br />
                                <strong>Status:</strong> {deal.status.name} <br />
                                <strong>Date:</strong>{" "}
                                {new Date(deal.date).toLocaleString()} <br />
                                <strong>Price:</strong> ${deal.finalPrice.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not accepted any deals yet.</p>
                )}
            </div>

            <div className="stats-panel">
                <h3>Statistics</h3>
                <p>
                    <strong>Total Deals:</strong> {stats.totalDeals}
                </p>
                <p>
                    <strong>Completed Deals:</strong> {stats.completedDeals}
                </p>
                <p>
                    <strong>Pending Deals:</strong> {stats.pendingDeals}
                </p>
                <p>
                    <strong>Canceled Deals:</strong> {stats.cancelledDeals}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
