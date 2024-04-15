const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      }
    }
    // Asegúrate de tener todas las opciones aquí.
  ],
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
  }
});

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = { QuestionModel };
