import React from "react";
import "./CustomAlert.css";

const CustomAlert = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="custom-alert-backdrop">
            <div className="custom-alert">
                <h3>Error</h3>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CustomAlert;
