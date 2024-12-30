import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "./ModelEditPage.css";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const ModelEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState(null);
    const [manufacturers, setManufacturers] = useState([]);
    const [modelNames, setModelNames] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [engines, setEngines] = useState([]);
    const [enginePlacements, setEnginePlacements] = useState([]);
    const [error, setError] = useState("");
    const [newModelName, setNewModelName] = useState("");
    const [showNewModelNameInput, setShowNewModelNameInput] = useState(false);
    const [newBodyType, setNewBodyType] = useState("");
    const [showNewBodyTypeInput, setShowNewBodyTypeInput] = useState(false);
    const [newEngineName, setNewEngineName] = useState("");
    const [newEngineVolume, setNewEngineVolume] = useState("");
    const [showNewEngineInput, setShowNewEngineInput] = useState(false);
    const [newEnginePlacement, setNewEnginePlacement] = useState("");
    const [showNewEnginePlacementInput, setShowNewEnginePlacementInput] = useState(false);
    const [showNewManufacturerInput, setShowNewManufacturerInput] = useState(false);
    const [newManufacturer, setNewManufacturer] = useState("");
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
                if (id) {
                    const modelRes = await axios.get(`http://localhost:8081/api/model:${id}`, {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                    setModel(modelRes.data);
                } else {
                    setModel({
                        id: null,
                        year: new Date().getFullYear(),
                        price: 0,
                        characteristics: {
                            id: null,
                            bodyType: null,
                            doorsCount: 4,
                            placesCount: 5,
                            engine: null,
                            enginePlacement: null,
                        },
                        modelName: {
                            id: null,
                            name: "",
                            manufacturer: null,
                        },
                    });
                }

                const [
                    manufacturersRes,
                    bodyTypesRes,
                    enginesRes,
                    enginePlacementsRes,
                ] = await Promise.all([
                    axios.get("http://localhost:8081/api/manufacturers", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                    axios.get("http://localhost:8081/api/bodytypes", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                    axios.get("http://localhost:8081/api/engines", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                    axios.get("http://localhost:8081/api/engineplacements", {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }).catch((err) => {showAlert("Status: " + err.status + " " + err.data)}),
                ]);

                setManufacturers(manufacturersRes.data || []);
                setBodyTypes(bodyTypesRes.data || []);
                setEngines(enginesRes.data || []);
                setEnginePlacements(enginePlacementsRes.data || []);
            } catch (error) {
                console.error("Failed to load data:", error.message);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [id]);

    const loadModelNamesForManufacturer = async (manufacturerId) => {
        if (manufacturerId) {
            try {
                const response = await axios.get(
                    `http://localhost:8081/api/modelnames:manu/${manufacturerId}`,
                    {
                        headers: { Authorization: `Bearer ${cookies.get("token")}` },
                    }
                ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setModelNames(response.data || []);
                setModel({
                    ...model,
                    modelName: response.data[0],
                })
            } catch (error) {
                console.error("Failed to load model names:", error.message);
                setError("Failed to load model names.");
            }
        } else {
            setModelNames([]);
        }
    };

    useEffect(() => {
        if (model?.modelName?.manufacturer?.id) {
            loadModelNamesForManufacturer(model.modelName.manufacturer.id);
        }
    }, [model?.modelName?.manufacturer?.id]);

    // Function to handle POST request for Manufacturer
    const handleAddManufacturer = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/manufacturer",
                { name: newManufacturer },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            const addedManufacturer = response.data;
            setManufacturers([...manufacturers, addedManufacturer]); // Add to the manufacturers list
            setModel({
                ...model,
                modelName: { ...model.modelName, manufacturer: addedManufacturer },
            });
            setNewManufacturer(""); // Clear the textbox
            setShowNewManufacturerInput(false); // Hide the input
            await loadModelNamesForManufacturer(model.modelName);
        } catch (error) {
            console.error("Failed to add manufacturer:", error.message);
            setError("Failed to add manufacturer.");
        }
    };

// Function to handle POST request for Engine
    const handleAddEngine = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/engine",
                { name: newEngineName, volume: parseFloat(newEngineVolume) },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            const addedEngine = response.data;
            setEngines([...engines, addedEngine]); // Add to the engines list
            setModel({
                ...model,
                characteristics: { ...model.characteristics, engine: addedEngine },
            });
            setNewEngineName(""); // Clear the textbox
            setNewEngineVolume(""); // Clear the textbox
            setShowNewEngineInput(false); // Hide the input
        } catch (error) {
            console.error("Failed to add engine:", error.message);
            setError("Failed to add engine.");
        }
    };

// Function to handle POST request for Body Type
    const handleAddBodyType = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/bodytype",
                { name: newBodyType },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            const addedBodyType = response.data;
            setBodyTypes([...bodyTypes, addedBodyType]); // Add to the body types list
            setModel({
                ...model,
                characteristics: { ...model.characteristics, bodyType: addedBodyType },
            });
            setNewBodyType(""); // Clear the textbox
            setShowNewBodyTypeInput(false); // Hide the input
        } catch (error) {
            console.error("Failed to add body type:", error.message);
            setError("Failed to add body type.");
        }
    };

    // Function to handle POST request for Engine Placement
    const handleAddEnginePlacement = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/engineplacement",
                { name: newEnginePlacement },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            const addedEnginePlacement = response.data;
            setEnginePlacements([...enginePlacements, addedEnginePlacement]); // Add to the engine placements list
            setModel({
                ...model,
                characteristics: { ...model.characteristics, enginePlacement: addedEnginePlacement },
            });
            setNewEnginePlacement(""); // Clear the textbox
            setShowNewEnginePlacementInput(false); // Hide the input
        } catch (error) {
            console.error("Failed to add engine placement:", error.message);
            setError("Failed to add engine placement.");
        }
    };

    const handleAddModelName = async () => {
        try {
            const newModelRes = await axios.post(
                "http://localhost:8081/api/modelname",
                {
                    name: newModelName,
                    manufacturer: model.modelName.manufacturer,
                },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            setModel({
                ...model,
                modelName: newModelRes.data,
            });

            setNewModelName(""); // Clear the textbox
            setShowNewModelNameInput(false); // Hide the input
        } catch (error) {
            console.error("Failed to add engine placement:", error.message);
            setError("Failed to add engine placement.");
        }
    };


    const handleModelNameChange = async (e) => {
        const modelNameId = parseInt(e.target.value);
        setModel({
            ...model,
            modelName: modelNames.find((model) => model.id === modelNameId),
        })
        console.log(model);
    }

    const handleManufacturerChange = async (e) => {
        const manufacturerId = parseInt(e.target.value);
        setModel({
            ...model,
            modelName: { ...model.modelName, manufacturer: manufacturers.find((m) => m.id === manufacturerId) },
        });

        await loadModelNamesForManufacturer(manufacturerId);
        console.log(model);
    };

    const handleBodyTypeChange = async (e) => {
        const bodyTypeId = parseInt(e.target.value);
        setModel({
            ...model,
            characteristics: { ...model.characteristics, bodyType: bodyTypes.find((bt) => bt.id === bodyTypeId) },
        });
    };

    const handleEngineChange = async (e) => {
        const engineId = parseInt(e.target.value);
        setModel({
            ...model,
            characteristics: { ...model.characteristics, engine: engines.find((eng) => eng.id === engineId) },
        });
    };

    const handleEnginePlacementChange = async (e) => {
        const enginePlacementId = parseInt(e.target.value);
        setModel({
            ...model,
            characteristics: {
                ...model.characteristics,
                enginePlacement: enginePlacements.find((ep) => ep.id === enginePlacementId),
            },
        });
    };

    const createCharacteristics = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/characteristic",
                {
                    bodyType: model.characteristics.bodyType,
                    doorsCount: model.characteristics.doorsCount,
                    placesCount: model.characteristics.placesCount,
                    engine: model.characteristics.engine,
                    enginePlacement: model.characteristics.enginePlacement,
                },
                {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }
            ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
            return response.data;
        } catch (error) {
            console.error("Failed to create characteristics:", error.message);
            setError("Failed to create characteristics.");
            throw error;
        }
    };

    const handleSave = async () => {
        try {

            // Create new characteristics first
            const newCharacteristics = await createCharacteristics(); // This will now return the updated characteristics

            // Once the characteristics are created, update the model state
            setModel((prevModel) => {
                // Now that we have the new model, you can send it
                return {
                    ...prevModel,
                    characteristics: newCharacteristics, // Updating the model with the new characteristics
                };
            });

            // Use the model with updated characteristics directly in the PUT request
            const endpoint = id ? `http://localhost:8081/api/model` : "http://localhost:8081/api/model";
            const method = id ? "put" : "post";

            await axios.post(endpoint, {
                ...model,
                characteristics: newCharacteristics,  // Use the updated characteristics here directly
            }, {
                headers: { Authorization: `Bearer ${cookies.get("token")}` },
            }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

            // Navigate after successfully saving the model
            navigate("/models");
        } catch (error) {
            console.error("Failed to save model:", error.message);
            setError("Failed to save changes.");
        }
    };

    const handleCancel = () => {
        navigate(`/goods`);
    };

    const toggleNewModelNameInput = () => {
        setShowNewModelNameInput(!showNewModelNameInput);
        setNewModelName("");
    };

    const toggleManufacturerInput = () => {
        setShowNewManufacturerInput(!showNewManufacturerInput);
        setNewManufacturer("");
    };

    const toggleNewBodyTypeInput = () => {
        setShowNewBodyTypeInput(!showNewBodyTypeInput);
        setNewBodyType("");
    };

    const toggleNewEngineInput = () => {
        setShowNewEngineInput(!showNewEngineInput);
        setNewEngineName("");
        setNewEngineVolume("");
    };

    const toggleNewEnginePlacementInput = () => {
        setShowNewEnginePlacementInput(!showNewEnginePlacementInput);
        setNewEnginePlacement("");
    };

    if (!model || manufacturers.length === 0 || bodyTypes.length === 0 || engines.length === 0 || enginePlacements.length === 0) {
        return <div>Loading...</div>;
    }

    const handleManage= () => {
        navigate(`/model/colors/${id}`);
    }

    return (
        <div className="model-edit-container">
            <CustomAlert
                message={alertMessage}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
            <h1>{id ? "Edit Model" : "Add Model"}</h1>
            {error && <p className="error-message">{error}</p>}

            {/* Model Name Field */}
            <div className="form-group">
                <label>Model Name</label>
                <div style={{display: "flex", alignItems: "center"}}>
                    <select
                        value={model.modelName.id || ""}
                        onChange={handleModelNameChange}
                    >
                        {modelNames.map((mn) => (
                            <option key={mn.id} value={mn.id}>
                                {mn.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={showNewModelNameInput ? "exit-button":"add-button"}
                        onClick={toggleNewModelNameInput}
                        style={{marginLeft: "10px"}}
                    >
                        {showNewModelNameInput ? "-" : "+"}
                    </button>
                </div>
                {showNewModelNameInput && (<div>
                        <input
                        type="text"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        placeholder="Enter new model name"
                        style={{marginTop: "10px"}}
                    />
                        <button className="save-button" onClick={handleAddModelName}>
                            Save
                        </button>
                    </div>

                )}
            </div>

            {/* Manufacturer Field */}
            <div className="form-group">
                <label>Manufacturer</label>
                <div style={{display: "flex", alignItems: "center"}}>
                    <select
                        value={model.modelName.manufacturer?.id || ""}
                        onChange={handleManufacturerChange}
                    >
                        <option value="">Select Manufacturer</option>
                        {manufacturers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={showNewManufacturerInput ? "exit-button":"add-button"}
                        onClick={toggleManufacturerInput}
                        style={{marginLeft: "10px"}}
                    >
                        {showNewManufacturerInput ? "-" : "+"}
                    </button>
                </div>
                {showNewManufacturerInput && (<div>
                        <input
                            type="text"
                            value={newManufacturer}
                            onChange={(e) => setNewManufacturer(e.target.value)}
                            placeholder="Enter new Manufacturer"
                            style={{marginTop: "10px"}}
                        />
                        <button className="save-button" onClick={handleAddManufacturer}>
                            Save
                        </button>
                    </div>

                )}
            </div>


            {/* Year Field */}
            <div className="form-group">
                <label>Year</label>
                <input
                    type="number"
                    value={model.year}
                    onChange={(e) => setModel({...model, year: parseInt(e.target.value)})}
                />
            </div>

            {/* Price Field */}
            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    value={model.price}
                    onChange={(e) => setModel({...model, price: parseFloat(e.target.value)})}
                />
            </div>

            {/* Body Type Field */}
            <div className="form-group">
                <label>Body Type</label>
                <div style={{display: "flex", alignItems: "center"}}>
                    <select
                        value={model.characteristics.bodyType?.id || ""}
                        onChange={handleBodyTypeChange}
                    >
                        <option value={model.characteristics.bodyType?.name || ""}>Select Body Type</option>
                        {bodyTypes.map((bt) => (
                            <option key={bt.id} value={bt.id}>
                                {bt.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={showNewBodyTypeInput ? "exit-button":"add-button"}
                        onClick={toggleNewBodyTypeInput}
                        style={{marginLeft: "10px"}}
                    >
                        {showNewBodyTypeInput ? "-" : "+"}
                    </button>
                </div>
                {showNewBodyTypeInput && (<div>

                    <input
                        type="text"
                        value={newBodyType}
                        onChange={(e) => setNewBodyType(e.target.value)}
                        placeholder="Enter new body type"
                        style={{marginTop: "10px"}}
                    />
                    <button className="save-button" onClick={handleAddBodyType}>
                        Save
                    </button>
                    </div>
                    )}
                </div>


                    <div className="form-group">
                    <label>Engine</label>
                    <div style={{display: "flex", alignItems: "center"}}>
                    <select
                        value={model.characteristics.engine?.id || ""}
                        onChange={handleEngineChange}
                    >
                        <option value="">Select Engine</option>
                        {engines.map((eng) => (
                            <option key={eng.id} value={eng.id}>
                                {eng.name} ({eng.volume}L)
                            </option>
                        ))}
                    </select>
                    <button
                        className={showNewEngineInput ? "exit-button":"add-button"}
                        onClick={toggleNewEngineInput}
                        style={{marginLeft: "10px"}}
                    >
                        {showNewEngineInput ? "-" : "+"}
                    </button>
                </div>
                {showNewEngineInput && (
                    <div>
                        <input
                            type="text"
                            value={newEngineName}
                            onChange={(e) => setNewEngineName(e.target.value)}
                            placeholder="Enter engine name"
                            style={{marginTop: "10px"}}
                        />
                        <input
                            type="number"
                            value={newEngineVolume}
                            onChange={(e) => setNewEngineVolume(e.target.value)}
                            placeholder="Enter engine volume"
                            style={{marginTop: "10px"}}
                        />
                        <button className="save-button" onClick={handleAddEngine}>
                            Save
                        </button>
                    </div>
                )}
                    </div>

            {/* Engine Placement Field */}
            <div className="form-group">
                <label>Engine Placement</label>
                <div style={{display: "flex", alignItems: "center"}}>
                    <select
                        value={model.characteristics.enginePlacement?.id || ""}
                        onChange={handleEnginePlacementChange}
                    >
                        <option value={model.characteristics.enginePlacement?.name || ""}>
                            Select Engine Placement
                        </option>
                        {enginePlacements.map((ep) => (
                            <option key={ep.id} value={ep.id}>
                                {ep.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={showNewEnginePlacementInput ? "exit-button":"add-button"}
                        onClick={toggleNewEnginePlacementInput}
                        style={{marginLeft: "10px"}}
                    >
                        {showNewEnginePlacementInput ? "-" : "+"}
                    </button>
                </div>
                {showNewEnginePlacementInput && (
                    <div>
                        <input
                            type="text"
                            value={newEnginePlacement}
                            onChange={(e) => setNewEnginePlacement(e.target.value)}
                            placeholder="Enter new engine placement"
                            style={{marginTop: "10px"}}
                        />
                        <button className="save-button" onClick={handleAddEnginePlacement}>
                            Save
                        </button>
                    </div>
                        )}
                    </div>

                {/* Places Count Field */}
                    <div className="form-group">
                    <label>Places Count</label>
                <input
                    type="number"
                    value={model.characteristics.placesCount}
                    onChange={(e) =>
                        setModel({
                            ...model,
                            characteristics: {
                                ...model.characteristics,
                                placesCount: parseInt(e.target.value),
                            },
                        })
                    }
                />
            </div>

            {/* Doors Count Field */}
            <div className="form-group">
                <label>Doors Count</label>
                <input
                    type="number"
                    value={model.characteristics.doorsCount}
                    onChange={(e) =>
                        setModel({
                            ...model,
                            characteristics: {
                                ...model.characteristics,
                                doorsCount: parseInt(e.target.value),
                            },
                        })
                    }
                />
            </div>

            {/* Buttons */}
            <div className="form-group">
                <button className="save-button-final" onClick={handleSave}>Save Edited Model</button>
                <button className="edit-color" onClick={handleManage}>Manage colors</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ModelEditPage;
