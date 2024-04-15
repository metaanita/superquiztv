import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // Asegúrate de que las rutas sean correctas
import Register from "./components/Register";
import AFrameScene from "./components/AFrameScene"; // Asume que tienes un componente para la escena de A-Frame

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aframe" element={<AFrameScene />} />
      </Routes>
    </Router>
  );
}

export default App;
