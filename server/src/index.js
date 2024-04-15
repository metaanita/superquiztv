const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/users");
const { questionsRouter } = require("./routes/questions");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/questions", questionsRouter);

// Solo establecer la conexión a MongoDB y escuchar en el puerto si no estamos en un entorno de prueba
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(
    "mongodb+srv://root:1234567890A@superquiztv.ssafxiv.mongodb.net/superquiztv?retryWrites=true&w=majority&appName=superquiztv",
    { useNewUrlParser: true, useUnifiedTopology: true } // Estas opciones son por defecto ahora, pero las incluyo por si acaso.
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`SERVER STARTED on port ${PORT}!`));
}

module.exports = app; // Modificado para usar CommonJS
