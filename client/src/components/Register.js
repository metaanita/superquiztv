import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/estilos.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registro completado con éxito. Ahora puedes iniciar sesión.");
      navigate("/"); // Redirige al login
    } catch (error) {
      console.error("Error de registro:", error);
      alert("Fallo al registrar, por favor intenta nuevamente.");
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
        <div className="registration form">
          <header>Registro</header>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Introduce tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Crea tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input type="submit" className="button" value="Registro" />
          </form>
          <div className="signup">
            <span>
              ¿Ya tienes cuenta?
              <Link to="/"> Accede al sitio</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
