import React, { useState, useEffect } from "react";
import "aframe"; // A-Frame importado a través de npm
import io from "socket.io-client";
import "../css/aframeStyle.css";

const AFrameScene = () => {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Estado para almacenar el índice de la pregunta actual
  const [score, setScore] = useState(0); // Estado para almacenar el marcador
  const [level, setLevel] = useState(1); // Estado para almacenar el nivel actual
  const [messageUsername, setMessageUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#FFFFFF"); // Estado para el color del mensaje
  const [buttonText, setButtonText] = useState("Iniciar el juego"); // Estado para el texto del botón
  const [buttonColor, setButtonColor] = useState("#7e2a93"); // Estado para el color del botón
  const [showThanksMessage, setShowThanksMessage] = useState(false); // Estado para mostrar el mensaje de agradecimiento
  const [showFelicitacionMessage, setShowFelicitacionMessage] = useState(false); // Estado para mostrar el mensaje de felicitacion
  const [resetGame, setResetGame] = useState(false);
  const [levelTimer, setLevelTimer] = useState(20); // Estado para el temporizador del nivel
  const levelNumber = level;
  const totalLevel = 3;
  const levelCounter = `Nivel : ${levelNumber} / ${totalLevel}`;
  const totalQuestions = Array.isArray(questions)
    ? questions.filter((question) => question.level === level).length
    : 0;
  const questionNumber = currentQuestionIndex + 1;
  const questionCounter = `Pregunta : ${questionNumber} / ${totalQuestions}`;
  const timer = `Te quedan : ${levelTimer} segundos`;
  const allQuestionsAnswered = currentQuestionIndex >= questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const username = window.localStorage.getItem("username");
  let intervalId;

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDateTime.toLocaleDateString(undefined, options);
  const [weekday, date] = formattedDate.split(", "); // Dividir la cadena en día y fecha
  const currentTime = currentDateTime.toLocaleTimeString();
  // Nuevo estado para el chat
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3001/questions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const questionsData = await response.json();
      const filteredQuestions = questionsData.filter(
        (question) => question.level === level
      ); // Filtrar las preguntas por el nivel actual
      const shuffledQuestions = filteredQuestions.sort(
        () => Math.random() - 0.5
      );

      if (Array.isArray(shuffledQuestions)) {
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(-1); // Reiniciar el índice de la pregunta actual al obtener nuevas preguntas
      } else {
        console.error(
          "El objeto devuelto no es un array de preguntas:",
          shuffledQuestions
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Función para enviar un mensaje al presionar Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage(); // Llama a la función sendMessage cuando se presiona Enter
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const socket = io("http://localhost:3001"); // Define la variable socket dentro de la función sendMessage
      // Envía el mensaje al servidor WebSocket
      socket.emit("message", { username, text: inputMessage });
      setInputMessage(""); // Limpiar el campo de entrada después de enviar el mensaje
      // Agrega el mensaje enviado al estado messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { username, text: inputMessage },
      ]);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => socket.disconnect();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    setCurrentDateTime(now);
  };

  useEffect(() => {
    const intervalId = setInterval(getCurrentDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const audio = new Audio("../audio/superquiztv-sintonia.mp3");
    audio.play();
    return () => {
      audio.currentTime = 0; // Reinicia el tiempo de reproducción al desmontar el componente
    };
  }, []); // Array de dependencias vacío para que el efecto se ejecute solo una vez al montar el componente

  useEffect(() => {
    const sceneContainer = document.querySelector("#escena");
    fetchQuestions();
    setLevelTimer(20);
    // Retrasar la rotación de la escena por 3 segundos
    setTimeout(() => {
      sceneContainer.setAttribute("animation", {
        property: "rotation",
        to: "0 -180 0",
        dur: 2000,
      });
    }, 5000);
  }, [resetGame, level]);

  // Función para iniciar el juego
  const handleStartGame = () => {
    setButtonText("Salir");
    setButtonColor("#FF0000");
    // Pasar a la primera pregunta
    setCurrentQuestionIndex(0);
    setMessage("");
    setLevelTimer(20);
  };

  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (username) {
      const usernameUpperCase = username.toUpperCase();
      setMessageUsername(usernameUpperCase);
      setMessage("¡Bienvenido/a a Super Quiz TV!");
      // setMessage(`${usernameUpperCase}, bienvenido/a a Super Quiz TV.`);
    }
  }, []);

  const handleExit = () => {
    // Mostrar el mensaje de agradecimiento
    setMessage("");
    setQuestions("");
    setButtonText("");
    setShowFelicitacionMessage(false);
    setShowThanksMessage(true);
    setTimeout(() => {
      setShowThanksMessage(false);
      setCurrentQuestionIndex(-1);
      setScore(0);
      setLevel(1);
      setMessage("¡Bienvenido/a a Super Quiz TV!");
      setMessageColor("#FFFFFF");
      setButtonText("Iniciar el juego");
      setButtonColor("#7e2a93");
      setResetGame(!resetGame); // Cambiar el estado resetGame para reiniciar el juego
    }, 2000); // La animación dura 1.5 segundos
  };

  useEffect(() => {
    if (levelTimer > 0 && currentQuestionIndex !== -1) {
      intervalId = setInterval(() => {
        setLevelTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (levelTimer === 0 && currentQuestionIndex !== -1) {
      const audio = new Audio("../audio/Respuesta_incorrecta.mp3");
      audio.play();
      setScore(0); // Reiniciar el marcador
      setCurrentQuestionIndex(0);
      setLevelTimer(20);
      setLevel(level);
      clearInterval(intervalId);
      setMessageColor("#FF0000");
      setButtonColor("#7e2a93");
      setMessage(`
          ¡Se acabó el tiempo! Vuelve a intentarlo. Nivel : ${levelNumber} / ${totalLevel}`);
      setButtonText(`Nivel : ${levelNumber} / ${totalLevel}`);
      setButtonText("Intentar de nuevo");
      fetchQuestions();
    }
    return () => clearInterval(intervalId);
  }, [levelTimer, currentQuestionIndex]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setMessage("¡ Respuesta correcta !");
      setMessageColor("#00FF00"); // Color verde
      setScore(score + 10); // Sumar 10 puntos al marcador

      if (score == 20 && level < totalLevel) {
        const audio = new Audio("../audio/aplausos-correcta.mp3");
        audio.play();
        clearInterval(intervalId);
        setLevelTimer(20);
        setLevel(level + 1); // Pasar al siguiente nivel si el marcador es igual a 20 y no estamos en el nivel máximo
        setScore(0); // Reiniciar el marcador
        setMessageColor("#FFFFFF");
        setButtonColor("#7e2a93");
        setButtonText("Siguiente nivel");
        setMessage(
          `¡Muy Bien! pasas al Nivel : ${levelNumber + 1} / ${totalLevel}`
        );
      } else if (score == 20 && level == totalLevel) {
        clearInterval(intervalId);
        setLevelTimer(20);
        setMessage("");
        setQuestions("");
        setButtonText("");
        setMessageColor("#00FF00"); // Color verde
        setShowThanksMessage(false);
        setShowFelicitacionMessage(true); // Mostrar el mensaje de felicitación
        const audio = new Audio("../audio/aplausos-correcta.mp3");
        audio.play();

        setTimeout(() => {
          handleExit();
        }, 10000);
      }
    } else {
      setMessage("¡ Respuesta incorrecta !");
      setMessageColor("#FF0000"); // Color rojo
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="aframe-container">
      <a-scene cursor="rayOrigin: mouse">
        <a-entity id="escena" position="-1 -2 0">
          <a-entity
            id="Studio"
            scale="3 3 3"
            position="0 0 -9"
            play-all-model-animations
            gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/news_broadcast_studio_set_vr_ready.glb?v=1710197418682"
            alt="Studio"
          ></a-entity>
          <a-entity
            id="Avatar-Moha"
            scale="2 2 2"
            position="-1 0 -7.7"
            animation-mixer=""
            play-all-model-animations
            gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/65ef07eefccb0ca0f6263b18.glb?v=1710197331276"
            alt="Avatar-Moha"
          ></a-entity>
          {/* <a-entity
            id="Avatar-Moha"
            scale="2 2 2"
            position="-1.6294 0.23964 -8.89422"
            gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/moham.glb?v=1711027006919"
            rotation="0 20.47 0"
            animation-mixer=""
        play-all-model-animations
          ></a-entity>{" "} */}

          <a-image
            src="../imagenes/pantalla2.jpg"
            position="0 5.348 8.99"
            rotation="0 180 0"
            width="3"
            height="2"
            material=""
            geometry=""
            scale="5.89 5.18 1"
          ></a-image>
          <a-image
            src="../imagenes/reloj.png"
            position="-13 8.5 8.9"
            rotation="0 180 0"
            material=""
            geometry=""
            scale="6.88 4 1"
          ></a-image>
          <a-text
            value={`Día: ${weekday}`}
            position="-12 9.6 8.8"
            rotation="0 180 0"
            color="#00FF00"
            width="10"
            font="Roboto-Regular-msdf.json"
          ></a-text>
          <a-text
            value={`${date}`}
            position="-11 8.9 8.8"
            rotation="0 180 0"
            color="#00FF00"
            width="10"
            font="Roboto-Regular-msdf.json"
          ></a-text>
          {/* Texto para mostrar la hora */}
          <a-text
            value={`Hora: ${currentTime}`}
            position="-11.7 7.4 8.8"
            rotation="0 180 0"
            color="#00FF00"
            width="10"
            font="Roboto-Regular-msdf.json"
          ></a-text>
          <a-entity
            id="Camara 1"
            scale="2 2 2"
            position="9.3256 0.08489 -14.20345"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -220 0"
          ></a-entity>
          <a-entity
            id="Camara 2"
            scale="2 2 2"
            position="0.43747 -0.055 -15.068"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -180 0"
          ></a-entity>
          <a-entity
            id="Camara 3"
            scale="2 2 2"
            position="-8.65632 -0.08253 -15.98713"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -140 0"
          ></a-entity>
          <a-entity
            id="Felipe"
            scale="2 2 2"
            rotation="0 50.566 0"
            position="-5 0 -5"
            animation-mixer=""
            gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/boy.glb?v=1712041457914"
          ></a-entity>
          <a-image
            id="TV1"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            geometry=""
            position="8.97387 3.99994 -22.8838"
            rotation="0 -12.7 0"
            scale="3 3 3"
          ></a-image>
          <a-image
            id="TV2"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            geometry=""
            position="-9.16645 4.09355 -23.03905"
            rotation="0 14.93 0"
            scale="3 3 3"
          ></a-image>
          <a-image
            id="TV3"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            position="-17.28378 3.22116 -15.78981"
            rotation="0 88.18 0"
            geometry=""
            scale="3 3 3"
          ></a-image>
          <a-entity
            id="trofeo"
            scale="0.1 0.1 0.1"
            position="0.1 2 8.1"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/trophy_cup_001.glb?v=1711493925823"
            rotation="0 -220 0"
            animation__scale={
              showFelicitacionMessage
                ? "property: scale; to: 0.7 0.7 0.7; dur: 3000"
                : ""
            } // Animación de escala condicional
            animation="property: rotation; to: 0 360 0; loop: true; dur: 8000"
            visible={showFelicitacionMessage} // Controla la visibilidad del trofeo
            // visible={true}
          ></a-entity>
          {currentQuestionIndex === -1 && (
            <>
              {/* Mensaje de bienvenida */}
              <a-text
                font="Roboto-Regular-msdf.json"
                value={messageUsername}
                color="#00FF00"
                position="0 8 8.9"
                align="center"
                rotation="0 180 0"
                width="12"
              ></a-text>
              <a-text
                font="Roboto-Regular-msdf.json"
                value={message}
                position="0 7 8.9"
                align="center"
                rotation="0 180 0"
                width="12"
                color={messageColor}
              ></a-text>
              {/* Botón de inicio del juego */}
              <a-box
                position="0 5 8.96"
                color={buttonColor}
                width="4"
                height="0.5"
                depth="0.2"
                onClick={handleStartGame}
              ></a-box>
              <a-text
                font="Roboto-Regular-msdf.json"
                value={buttonText}
                color="#FFFFFF"
                position="0 5 8.85"
                width="8"
                align="center"
                text=""
                rotation="0 180 0"
              ></a-text>
            </>
          )}
          {!allQuestionsAnswered && currentQuestionIndex !== -1 && (
            <>
              {/* Mostrar el nivel */}
              <a-text
                value={levelCounter}
                position="4 9 8.9"
                rotation="0 180 0"
                width="8"
                color="#FFFFFF"
                text=""
              ></a-text>
              {/* Mostrar el cronometro */}
              <a-text
                value={timer}
                position="-2 9 8.9"
                rotation="0 180 0"
                width="8"
                color="#FFFFFF"
                text=""
              ></a-text>
              {/* Barras de progreso */}
              <a-box
                position="3.5 8.4 8.9"
                rotation="0 180 0"
                width="4" // Ancho total de la barra
                depth="0.2"
                height="0.2"
                color="#FFFFFF" // Establecer el color del fondo blanco
                material="opacity: 0.2" // Ajustar la opacidad si es necesario
              ></a-box>
              <a-box
                position={`${1.7 + level / totalLevel} 8.4 8.9`}
                rotation="0 180 0"
                width={`${(level / totalLevel) * 3}`} // Ancho ajustado según el progreso del nivel
                depth="0.2"
                height="0.2"
                color="#00FF00" // Color de la barra de progreso
              ></a-box>

              <a-box
                position="-4 8.4 8.9" // Posición ajustada para que el lado izquierdo sea fijo
                rotation="0 180 0"
                width="4" // Ancho total de la barra
                depth="0.2"
                height="0.2"
                color="#FFFFFF" // Establecer el color del fondo blanco
                material="opacity: 0.2" // Ajustar la opacidad si es necesario
              ></a-box>
              <a-box
                position={`${-6 + (levelTimer / 20) * 2} 8.4 8.9`}
                rotation="0 180 0"
                width={(levelTimer / 20) * 4} // Ancho ajustado para que la barra disminuya solo por el lado izquierdo
                depth="0.2"
                height="0.2"
                color="#00FF00" // Color de la barra de progreso
              ></a-box>

              {/* Mostrar el numero de pregunta */}
              <a-text
                value={questionCounter}
                position="-3.1 1.3 8.9"
                rotation="0 180 0"
                width="8"
                color="#FFFFFF"
                text=""
              ></a-text>

              {/* Mostrar la pregunta y las opciones */}
              <a-text
                font="Roboto-Regular-msdf.json"
                value={currentQuestion.text}
                align="center"
                position="0 7 8.9"
                rotation="0 180 0"
                width="10"
                color="#FFFFFF"
              ></a-text>
              {currentQuestion.options.map((option, index) => (
                <React.Fragment key={index}>
                  <a-box
                    depth="0.2"
                    position={`0 ${5 - index * 0.7} 8.96`}
                    rotation="0 180 0"
                    color="#7e2a93"
                    width="8"
                    height="0.5"
                    onClick={() => handleAnswer(option.isCorrect)}
                  ></a-box>
                  <a-text
                    font="Roboto-Regular-msdf.json"
                    rotation="0 180 0"
                    value={option.text}
                    position={`0 ${5 - index * 0.7} 8.85
                    `}
                    width="8"
                    align="center"
                  ></a-text>
                </React.Fragment>
              ))}
            </>
          )}
          {/* Mostrar mensaje de despedida */}
          {showThanksMessage && (
            <a-text
              value="Gracias por participar y hasta la próxima."
              position="4.5 7 8.9"
              rotation="0 180 0"
              width="12"
              color="#FFFFFF"
              font="Roboto-Regular-msdf.json"
            ></a-text>
          )}
          {/* Mostrar mensaje de felicitacion */}
          {showFelicitacionMessage && (
            <a-text
              value="¡ Enhorabuena has terminado todos los niveles !"
              position="5.5 7 8.9"
              rotation="0 180 0"
              width="12"
              color="#FFFFFF"
              font="Roboto-Regular-msdf.json"
            ></a-text>
          )}
          {currentQuestionIndex !== -1 && !showThanksMessage && (
            <>
              {/* Mostrar mensaje de respuesta */}
              <a-text
                font="Roboto-Regular-msdf.json"
                value={message}
                position="2 1.5 8.9"
                rotation="0 180 0"
                width="8"
                color={messageColor}
              ></a-text>
              <a-text
                font="Roboto-Regular-msdf.json"
                value={`Marcador: ${score} Puntos`}
                position="-3 2 8.9"
                rotation="0 180 0"
                width="8"
                color="#FFFFFF"
              ></a-text>
              {/* Botón para salir */}
              <a-box
                position="5 1.5 8.96"
                color="#FF0000"
                width="2"
                height="0.5"
                depth="0.2"
                onClick={handleExit}
              ></a-box>
              <a-text
                font="Roboto-Regular-msdf.json"
                value="Salir"
                color="#FFFFFF"
                position="5 1.5 8.85"
                width="8"
                align="center"
                rotation="0 180 0"
              ></a-text>
            </>
          )}
          {/* Mostrar los mensajes */}
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <span className="username">{message.username}: </span>
                <span className="text">{message.text}</span>
              </div>
            ))}
          </div>
          {/* Contenedor del campo de entrada */}
          <div className="input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress} // Agrega el manejador de eventos para la tecla Enter
              placeholder="Escribe tu mensaje..."
            />
          </div>
          {/* <a-entity position="11 2 8" scale="2 2 2">
            <a-input
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onInput={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e)}
            ></a-input>
          </a-entity>
          {messages.map((message, index) => (
            <a-entity key={index} position="11 1 8" scale="2 2 2">
              <a-text value={`${message.username}: ${message.text}`}></a-text>
            </a-entity>
          ))} */}
        </a-entity>
      </a-scene>
    </div>
  );
};

export default AFrameScene;
