import React, { useState, useEffect } from "react";
import "./ModelsGallery.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const ModelsGallery = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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


    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const modelsRes = await axios.get("http://localhost:8081/api/models", {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setModels(modelsRes.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = (modelId) => {
        navigate(`/model/edit/${modelId}`);
    };

    const handleDelete = async (modelId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this model?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8081/api/models/${modelId}`, {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setModels((prevModels) => prevModels.filter((model) => model.id !== modelId));
            } catch (err) {
                alert("An error occurred while deleting the model.");
            }
        }
    };

    const handleAddModel = () => {
        navigate("/model/edit/");
    };

    return (
        <div className="models-gallery">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            {/* Add Model Card */}
            <div className="models-card add-model-card" onClick={handleAddModel}>
                <div className="add-icon">
                    <img
                        src="https://cdn-icons-png.freepik.com/512/6066/6066857.png"
                        alt="Add"
                        style={{ width: "100%", height: "90%" }}
                    />
                </div>
                <p>Add New Model</p>
            </div>

            {/* Existing Models */}
            {models.map((model) => (
                <div className="models-card" key={model.id}>
                    <h3 className="models-title">{model.modelName?.name || "Unknown"}</h3>
                    <p>
                        <strong>Manufacturer:</strong> {model.modelName?.manufacturer?.name || "Unknown"}
                    </p>
                    <p>
                        <strong>Year:</strong> {model.year || "Unknown"}
                    </p>
                    <p>
                        <strong>Body Type:</strong> {model.characteristics?.bodyType?.name || "Unknown"}
                    </p>
                    <p>
                        <strong>Doors:</strong> {model.characteristics?.doorsCount || "Unknown"}
                    </p>
                    <p>
                        <strong>Seats:</strong> {model.characteristics?.placesCount || "Unknown"}
                    </p>
                    <p>
                        <strong>Engine:</strong>{" "}
                        {model.characteristics?.engine
                            ? `${model.characteristics.engine.name} (${model.characteristics.engine.volume}L)`
                            : "Unknown"}
                    </p>
                    <p>
                        <strong>Engine Placement:</strong>{" "}
                        {model.characteristics?.enginePlacement?.name || "Unknown"}
                    </p>
                    <p>
                        <strong>Price:</strong> ${model.price.toFixed(2)}
                    </p>
                    <div className="button-container">
                        <button className="edit-button" onClick={() => handleEdit(model.id)}>
                            Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(model.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ModelsGallery;
