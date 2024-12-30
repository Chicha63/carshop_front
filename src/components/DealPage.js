import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DealPage.css"
import Cookies from "universal-cookie";

const DealPage = () => {
    const { id } = useParams(); // Get the deal ID from the URL
    const [deal, setDeal] = useState(null);
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/authed/deal:${id}`, {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                });
                if (response.status === 200) {
                    setDeal(response.data);
                } else {
                    console.error("Error fetching deal:", response.data);
                }
            } catch (error) {
                console.error("Error fetching deal:", error);
            }
        };

        fetchDeal();
    }, [id]);

    const handleAccept = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8081/api/authed/dealemployee:${id}`,
                {},
                { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
            );
            if (response.status === 200) {
                alert("Deal accepted!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error accepting deal:", error);
        }
    };

    const handleCancel = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8081/api/authed/canceldeal:${id}`,
                {},
                { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
            );
            if (response.status === 200) {
                alert("Deal canceled!");
                navigate("/dashboard"); // Navigate back to the dashboard
            }
        } catch (error) {
            console.error("Error canceling deal:", error);
        }
    };

    const handleFinish = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8081/api/authed/finishdeal:${id}`,
                {},
                { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
            );
            if (response.status === 200) {
                alert("Deal fished successfully!");
                navigate("/dashboard"); // Navigate back to the dashboard
            }
        } catch (error) {
            console.error("Error canceling deal:", error);
        }
    };

    if (!deal) {
        return <p>Loading deal details...</p>;
    }

    return (
        <div className="deal-page-container">
            <h1>Deal Information</h1>
            <div className="deal-info">
                <p><strong>Deal ID:</strong> {deal.id}</p>
                <p><strong>Client Name:</strong> {deal.client.fullName}</p>
                <p><strong>Client Address:</strong> {deal.client.adress}</p>
                <p><strong>Client Email:</strong> {deal.client.email}</p>
                <p><strong>Client Phone:</strong> {deal.client.phone}</p>
                <p><strong>Good Model:</strong> {deal.good.model.modelName.name}</p>
                <p><strong>Manufacturer:</strong> {deal.good.model.modelName.manufacturer.name}</p>
                <p><strong>Year:</strong> {deal.good.model.year}</p>
                <p><strong>Price:</strong> ${deal.finalPrice.toFixed(2)}</p>
                <p><strong>Status:</strong> {deal.status.name}</p>
                <p><strong>Date:</strong> {new Date(deal.date).toLocaleDateString()}</p>
                <p><strong>Delivery:</strong> {deal.delivery ? "Yes" : "No"}</p>
                <p><strong>Payment Method:</strong> {deal.payment.name}</p>
            </div>
            {deal.status.name === "Accepted" ?
                <div>
                    <button className="accept-button" onClick={handleFinish}>
                        Close Deal
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                        Cancel Deal
                    </button>
                </div>
                    : deal.status.name === "Canceled" ? <>Deal canceled</>
                    : deal.status.name === "Pending..." ?
                    <div>
                        <button className="accept-button" onClick={handleAccept}>
                            Accept Deal
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel Deal
                        </button>
                    </div>:<>Deal completed</>
                    }


                </div>
                );
            };

            export default DealPage;
