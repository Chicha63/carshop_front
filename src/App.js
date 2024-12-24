import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import SidePanel from "./components/SidePanel";
import Signup from "./components/Signup";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

    const toggleSidePanel = () => {
        setIsSidePanelVisible((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false); // Trigger re-render
    };

    useEffect(() => {
        // Re-check authentication on token changes
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="App">
            <Router>
                {isAuthenticated ? (
                    <div style={{ display: "flex", height: "100vh" }}>
                        {/* Side Panel */}
                        {isSidePanelVisible && (
                            <SidePanel
                                onLogout={handleLogout} // Pass logout handler
                                style={{
                                    width: "270px",
                                    background: "#333",
                                    color: "#fff",
                                    position: "relative",
                                    zIndex: 100,
                                    height: "100vh",
                                    transition: "transform 0.3s ease",
                                }}
                            />
                        )}

                        {/* Toggle Button */}
                        <button
                            onClick={toggleSidePanel}
                            style={{
                                position: "absolute",
                                top: "0px",
                                left: isSidePanelVisible ? "270px" : "0px",
                                zIndex: 1,
                                background: isSidePanelVisible ? "#2c3e50" : "transparent",
                                height: isSidePanelVisible ? "100%" : "4.5%",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "24px",
                                color: isSidePanelVisible ? "white" : "black",
                                transform: isSidePanelVisible ? "translateX(-10%)" : "translateX(0)",
                                transition: "left 0.4s ease",
                            }}
                        >
                            {isSidePanelVisible ? "˂" : "☰"}
                        </button>

                        {/* Page Content */}
                        <div
                            style={{
                                flex: 1,
                                marginLeft: isSidePanelVisible ? "50px" : "50px",
                                transition: "margin-left 1s ease",
                            }}
                        >
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    </Routes>
                )}
            </Router>
        </div>
    );
}

export default App;
