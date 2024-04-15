const express = require('express');
const { QuestionModel } = require('../models/Questions'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const questions = await QuestionModel.find({});
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { text, options, level } = req.body;

  const question = new QuestionModel({
    text,
    options,
    level,
  });

  try {
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:questionId", async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:questionId", async (req, res) => {
  try {
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:questionId", async (req, res) => {
  try {
    const deletedQuestion = await QuestionModel.findByIdAndDelete(req.params.questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { questionsRouter: router };
