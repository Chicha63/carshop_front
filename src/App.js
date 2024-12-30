import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import SidePanel from "./components/SidePanel";
import Signup from "./components/Signup";
import Account from "./components/AccountSettings";
import AccountSettings from "./components/AccountSettings";
import GoodsGallery from "./components/GoodsGallery";
import GoodsPage from "./components/GoodsPage";
import GoodEditPage from "./components/GoodEditPage";
import ModelEditPage from "./components/ModelEditPage";
import ModelColorsPage from "./components/ModelColorsPage";
import GoodAddPage from "./components/GoodAddPage";
import ModelsPage from "./components/ModelsPage";
import DealsPage from "./components/DealsPage";
import DealPage from "./components/DealPage";
import Cookies from 'universal-cookie';

function App() {
    const cookies = new Cookies();
    const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.get("token"));
    console.log(!!cookies.get("token"));
    console.log(isAuthenticated);
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

    const toggleSidePanel = () => {
        setIsSidePanelVisible((prev) => !prev);
    };

    const handleLogout = () => {
        cookies.set("token", null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = cookies.get("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="App">
            <Router>
                {isAuthenticated ? (
                    <div style={{display: "flex", height: "100vh"}}>
                        {isSidePanelVisible && (
                            <SidePanel
                                onLogout={handleLogout}
                                style={{
                                    width: "270px",
                                    background: "#333",
                                    color: "#fff",
                                    position: "relative",
                                    zIndex: 2,
                                    height: "100%",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        )}

                        <button
                            onClick={toggleSidePanel}
                            style={{
                                position: "fixed",
                                top: "0",
                                left: isSidePanelVisible ? "270px" : "0px",
                                zIndex: 2,
                                background: isSidePanelVisible ? "#2c3e50" : "#ecf0f1",
                                height: "100vh",
                                width: "30px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "24px",
                                color: isSidePanelVisible ? "white" : "black",
                                transform: isSidePanelVisible ? "translateX(-10%)" : "translateX(0)",
                                transition: "left 0.4s ease",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {isSidePanelVisible ? "˂" : "☰"}
                        </button>

                        <div
                            style={{
                                flex: 1,
                                marginLeft: isSidePanelVisible ? "300px" : "30px",
                                transition: "margin-left 1s ease",
                            }}
                        >
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/account" element={<AccountSettings/>}/>
                                <Route path="/signup" element={<Signup/>}/>
                                <Route path="/goods" element={<GoodsPage/>}/>
                                <Route path="/goods/edit/:id" element={<GoodEditPage/>}/>
                                <Route path="/model/edit/:id" element={<ModelEditPage/>}/>
                                <Route path="/model/edit" element={<ModelEditPage/>}/>
                                <Route path="/model/colors/:modelId" element={<ModelColorsPage/>}/>
                                <Route path="/models" element={<ModelsPage/>}/>
                                <Route path={"/goods/add"} element={<GoodAddPage/>}/>
                                <Route path={"/deal/:id"} element={<DealPage/>}/>
                                {/*<Route path={"/deals"} element={<DealsPage/>}/>*/}
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                        <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
                    </Routes>
                )}
            </Router>
        </div>
    );
}

export default App;
