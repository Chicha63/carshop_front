import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GoodAddPage.css";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const GoodAddPage = () => {
    const navigate = useNavigate();
    const [good, setGood] = useState({
        model: null,
        color: null,
        country: null,
        availability: null,
        price: "",
    });
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [countries, setCountries] = useState([]);
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
                const [modelsRes, availabilitiesRes, countriesRes] = await Promise.all([
                    axios.get("http://localhost:8081/api/models", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                    axios.get("http://localhost:8081/api/availabilities", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                    axios.get("http://localhost:8081/api/countries", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                ]);

                setModels(modelsRes.data || []);
                setAvailabilities(availabilitiesRes.data || []);
                setCountries(countriesRes.data || []);
            } catch (error) {
                console.error("Failed to load data:", error.message);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, []);

    const fetchColorsForModel = async (modelId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/modelcolors:${modelId}`, {
                headers: { Authorization: `Bearer ${cookies.get("token")}` },
            }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            setColors(response.data || []);
        } catch (error) {
            console.error("Failed to fetch colors for the model:", error.message);
            setError("Failed to load possible colors.");
        }
    };

    const handleModelChange = async (modelId) => {
        const selectedModel = models.find((model) => model.id === parseInt(modelId));
        if (selectedModel) {
            await fetchColorsForModel(modelId);
            setGood((prevGood) => ({
                ...prevGood,
                model: selectedModel,
            }));
        }
    };

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:8081/api/authed/good`, good, {
                headers: { Authorization: `Bearer ${cookies.get("token")}` },
            }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            navigate("/goods");
        } catch (error) {
            console.error("Failed to save good details:", error.message);
            setError("Failed to save the good.");
        }
    };

    const handleCancel = () => {
        navigate(`/goods`);
    };

    if (models.length === 0 || availabilities.length === 0 || countries.length === 0) {
        return <div>Loading...</div>;
    }

    const editModel = () => {
        navigate(`/model/edit/${good.model.id}`);
    }

    return (

        <div className="good-add-container">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <h1>Add New Good</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
                <label>Model</label>
                <select
                    onChange={(e) => handleModelChange(e.target.value)}
                >
                    <option value="">Select a Model</option>
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.modelName.name} ({model.year}, {model.characteristics.engine.name} {model.characteristics.engine.volume}L)
                        </option>
                    ))}
                </select>
            </div>

            {good.model && (
                <>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" value={good.model.modelName.manufacturer.name} readOnly/>
                    </div>

                    <div className="form-group">
                        <label>Body Type</label>
                        <input type="text" value={good.model.characteristics.bodyType.name} readOnly/>
                    </div>

                    <div className="form-group">
                        <label>Doors Count</label>
                        <input type="text" value={good.model.characteristics.doorsCount} readOnly/>
                    </div>

                    <div className="form-group">
                        <label>Seats Count</label>
                        <input type="text" value={good.model.characteristics.placesCount} readOnly/>
                    </div>

                    <div className="form-group">
                        <label>Engine</label>
                        <input
                            type="text"
                            value={`${good.model.characteristics.engine.name} (${good.model.characteristics.engine.volume}L)`}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Year</label>
                        <input type="number" value={good.model.year} readOnly/>
                    </div>
                </>
            )}

            <div className="form-group">
                <label>Color</label>
                <select
                    onChange={(e) =>
                        setGood({
                            ...good,
                            color: colors.find((color) => color.id === parseInt(e.target.value)),
                        })
                    }
                >
                    <option value="">Select a Color</option>
                    {colors.map((color) => (
                        <option key={color.id} value={color.id}>
                            {color.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Country</label>
                <select
                    onChange={(e) =>
                        setGood({
                            ...good,
                            country: countries.find((country) => country.id === parseInt(e.target.value)),
                        })
                    }
                >
                    <option value="">Select a Country</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Availability</label>
                <select
                    onChange={(e) =>
                        setGood({
                            ...good,
                            availability: availabilities.find(
                                (availability) => availability.id === parseInt(e.target.value)
                            ),
                        })
                    }
                >
                    <option value="">Select Availability</option>
                    {availabilities.map((availability) => (
                        <option key={availability.id} value={availability.id}>
                            {availability.type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    value={good.model?.price || ""}
                    onChange={(e) =>
                        setGood({
                            ...good,
                            model: {...good.model, price: parseFloat(e.target.value) || 0},
                        })
                    }
                />
            </div>

            <button className="save-button1" onClick={handleSave}>
                Add Good
            </button>
            <button className="edit-button" onClick={editModel} style={{marginTop: 10}}>
                Edit Model
            </button>
            <button className="cancel-button" onClick={handleCancel}>
                Cancel
            </button>
        </div>
    );
};

export default GoodAddPage;
