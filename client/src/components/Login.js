import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import "../css/estilos.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token, { path: "/" });
      window.localStorage.setItem("userID", result.data.userID);
      window.localStorage.setItem("username", username); // Guarda el nombre de usuario en el almacenamiento local
      navigate("/aframe");
    } catch (error) {
      console.error("Error de login:", error);
      alert("Fallo al iniciar sesión, verifica tus credenciales.");
    }
  };

  return (
    <>
      <div
        className="logo-container"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        <img src="../imagenes/logo-mini.png" alt="Logo" />
      </div>
      <div className="container">
        <div className="login form">
          <header>Login</header>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Introduce tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" className="button" value="Login" />
          </form>
          <div className="signup">
            <span>
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
