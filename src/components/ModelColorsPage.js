import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ModelColorsPage.css";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const ModelColorsPage = () => {
    const { modelId } = useParams();
    const [availableColors, setAvailableColors] = useState([]);
    const [possibleColors, setPossibleColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedRemoveColors, setSelectedRemoveColors] = useState([]);
    const [newColorName, setNewColorName] = useState("");
    const [newColorCoefficient, setNewColorCoefficient] = useState("");
    const [error, setError] = useState("");
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
        const fetchData = async () => {
            try {
                // Fetch all available colors
                const availableRes = await axios.get(`http://localhost:8081/api/colors`, {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

                // Fetch colors already associated with the model
                const possibleRes = await axios.get(`http://localhost:8081/api/modelcolors:${modelId}`, {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

                const possibleColorsData = possibleRes.data || [];
                const availableColorsData = (availableRes.data || []).filter(
                    (color) => !possibleColorsData.some((possible) => possible.id === color.id)
                );

                setAvailableColors(availableColorsData);
                setPossibleColors(possibleColorsData);
            } catch (error) {
                console.error("Failed to load data:", error.message);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [modelId]);

    const handleAddColors = async () => {
        try {
            for (const color of selectedColors) {
                await axios.post(
                    `http://localhost:8081/api/authed/model/${modelId}/color`,
                    color,
                    { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
                ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            }

            const updatedAvailableColors = availableColors.filter(
                (color) => !selectedColors.includes(color)
            );
            const updatedPossibleColors = [...possibleColors, ...selectedColors];

            setAvailableColors(updatedAvailableColors);
            setPossibleColors(updatedPossibleColors);
            setSelectedColors([]);
        } catch (error) {
            console.error("Failed to add colors:", error.message);
            setError("Failed to add colors.");
        }
    };

    const handleRemoveColors = async () => {
        try {
            for (const color of selectedRemoveColors) {
                await axios.delete(
                    `http://localhost:8081/api/authed/modelcolors:${modelId}/${color.id}`,
                    { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
                ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            }

            const updatedPossibleColors = possibleColors.filter(
                (color) => !selectedRemoveColors.includes(color)
            );

            const updatedAvailableColors = [
                ...availableColors,
                ...selectedRemoveColors.filter(
                    (color) => !availableColors.some((availableColor) => availableColor.id === color.id)
                ),
            ];

            setAvailableColors(updatedAvailableColors);
            setPossibleColors(updatedPossibleColors);
            setSelectedRemoveColors([]);
        } catch (error) {
            console.error("Failed to remove colors:", error.message);
            setError("Failed to remove colors.");
        }
    };

    const handleAddNewColor = async () => {
        try {
            if (!newColorName || !newColorCoefficient) {
                setError("Both name and coefficient are required.");
                return;
            }

            const response = await axios.post(
                `http://localhost:8081/api/color`,
                { name: newColorName, coeficient: newColorCoefficient },
                { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            const newColor = response.data;
            setAvailableColors((prevColors) => [...prevColors, newColor]);
            setNewColorName("");
            setNewColorCoefficient("");
            setError("");
        } catch (error) {
            console.error("Failed to add new color:", error.message);
            setError("Failed to add new color.");
        }
    };

    const toggleColorSelection = (color, type) => {
        if (type === "add") {
            setSelectedColors((prevSelected) =>
                prevSelected.includes(color)
                    ? prevSelected.filter((c) => c !== color)
                    : [...prevSelected, color]
            );
        } else if (type === "remove") {
            setSelectedRemoveColors((prevSelected) =>
                prevSelected.includes(color)
                    ? prevSelected.filter((c) => c !== color)
                    : [...prevSelected, color]
            );
        }
    };

    return (
        <div className="model-colors-container">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <h1>Manage Colors for Model #{modelId}</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="tables-container">
                <div className="table-section">
                    <h2>Available Colors</h2>
                    <table className="color-table">
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>Color Name</th>
                            <th>Coefficient</th>
                        </tr>
                        </thead>
                        <tbody>
                        {availableColors.length > 0 ? (
                            availableColors.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedColors.includes(row)}
                                            onChange={() => toggleColorSelection(row, "add")}
                                        />
                                    </td>
                                    <td>{row.name}</td>
                                    <td>{row.coefficient}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row">
                                <td colSpan="3">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button
                        className="add-button"
                        onClick={handleAddColors}
                        disabled={selectedColors.length === 0}
                    >
                        Add Selected Colors
                    </button>
                </div>

                <div className="table-section">
                    <h2>Possible Colors for Model</h2>
                    <table className="color-table">
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>Color Name</th>
                            <th>Coefficient</th>
                        </tr>
                        </thead>
                        <tbody>
                        {possibleColors.length > 0 ? (
                            possibleColors.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedRemoveColors.includes(row)}
                                            onChange={() => toggleColorSelection(row, "remove")}
                                        />
                                    </td>
                                    <td>{row.name}</td>
                                    <td>{row.coefficient}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="empty-row">
                                <td colSpan="3">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <button
                        className="remove-button"
                        onClick={handleRemoveColors}
                        disabled={selectedRemoveColors.length === 0}
                    >
                        Remove Selected Colors
                    </button>
                </div>
            </div>

            <div className="new-color-form">
                <h2>Add New Color</h2>
                <div className="form-group">
                    <label htmlFor="newColorName">Color Name:</label>
                    <input
                        id="newColorName"
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newColorCoefficient">Coefficient:</label>
                    <input
                        id="newColorCoefficient"
                        type="number"
                        step="0.01"
                        value={newColorCoefficient}
                        onChange={(e) => setNewColorCoefficient(e.target.value)}
                    />
                </div>
                <button className="add-new-color-button" onClick={handleAddNewColor}>
                    Add Color
                </button>
            </div>
        </div>
    );
};

export default ModelColorsPage;
