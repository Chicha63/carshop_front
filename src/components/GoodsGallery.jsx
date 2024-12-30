import React, {useRef, useState} from "react";
import "./GoodsGallery.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import Cookies from "universal-cookie";

const GoodsGallery = ({ goods, setGoods }) => {
    const navigate = useNavigate();
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

    const handleEdit = (goodId) => {
        navigate(`/goods/edit/${goodId}`);
    };

    const handleDelete = async (goodId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8081/api/authed/good:${goodId}`, {
                    headers: { Authorization: `Bearer ${cookies.get("token")}` },
                }).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});
                setGoods((prevGoods) => prevGoods.filter((good) => good.id !== goodId));
            } catch (error) {
                console.error("Failed to delete the item:", error.message);
                alert("An error occurred while deleting the item.");
            }
        }
    };

    const handleAddGood = () => {
        navigate("/goods/add");
    };

    const handleImageUpload = async (goodId, event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                await axios.post(
                    `http://localhost:8081/api/authed/${goodId}/upload-image`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.get("token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                ).catch((err) => {showAlert("Status: " + err.status + " " + err.response.data);throw new Error("Status: " + err.status + " " + err.response.data)});

                setGoods((prevGoods) => [...prevGoods]);
            } catch (error) {
                console.error("Failed to upload the image:", error.message);
                window.location.reload();
            }
        }
    };

    const fileInputRefs = useRef({});

    return (

        <div className="goods-gallery">
            <CustomAlert
            message={alertMessage}
            isVisible={isAlertVisible}
            onClose={closeAlert}
            />
            <div className="goods-card add-model-card" onClick={handleAddGood}>
                <div className="add-icon">
                    <img
                        src="https://cdn-icons-png.freepik.com/512/6066/6066857.png"
                        alt="+"
                        style={{ width: "100%", height: "90%" }}
                    />
                </div>
                <p>Add New Good</p>
            </div>

            {goods.map((good) => (
                <div className="goods-card" key={good.id}>
                    <div
                        className="goods-image"
                        onClick={() => fileInputRefs.current[good.id].click()}
                    >
                        <img
                            src={`http://localhost:8081/img/${good.id}.jpg`}
                            alt={good.model.modelName.name}
                            style={{width: "100%", height: "150px", objectFit: "cover"}}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150"; // Fallback image
                            }}
                        />
                    </div>
                    <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[good.id] = el)}
                        style={{display: "none"}}
                        onChange={(e) => handleImageUpload(good.id, e)}
                    />

                    <h3 className="goods-title">{good.model.modelName.name}</h3>
                    <p>
                        <strong>Manufacturer:</strong> {good.model.modelName.manufacturer.name}
                    </p>
                    <p>
                        <strong>Year:</strong> {good.model.year}
                    </p>
                    <p>
                        <strong>Body Type:</strong> {good.model.characteristics.bodyType.name}
                    </p>
                    <p>
                        <strong>Doors:</strong> {good.model.characteristics.doorsCount}
                    </p>
                    <p>
                        <strong>Seats:</strong> {good.model.characteristics.placesCount}
                    </p>
                    <p>
                        <strong>Engine:</strong> {good.model.characteristics.engine.name} (
                        {good.model.characteristics.engine.volume}L)
                    </p>
                    <p>
                        <strong>Engine Placement:</strong> {good.model.characteristics.enginePlacement.name}
                    </p>
                    <p>
                        <strong>Color:</strong> {good.color.name}
                    </p>
                    <p>
                        <strong>Availability:</strong> {good.availability.type}
                    </p>
                    <p>
                        <strong>Price:</strong> ${good.price.toLocaleString()}
                    </p>
                    <div className="button-container">
                        <button className="edit-button" onClick={() => handleEdit(good.id)}>
                            Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(good.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GoodsGallery;
