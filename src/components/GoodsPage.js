import React, { useEffect, useState } from "react";
import GoodsGallery from "./GoodsGallery";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const GoodsPage = () => {
    const [goods, setGoods] = useState([]);
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
        const fetchGoods = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/goods", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setGoods(response.data);
            } catch (error) {
                console.error("Failed to fetch goods:", error.message);
            }
        };

        fetchGoods();
    }, []);

    return (
        <div>
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <h1 style={{ textAlign: "center", margin: "20px 0" }}>Goods Gallery</h1>
            <GoodsGallery goods={goods} />
        </div>
    );
};

export default GoodsPage;
