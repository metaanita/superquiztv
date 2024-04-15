const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/index'); // Asegúrate de que esto coincida con la ruta correcta a tu archivo

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Questions API', () => {
  describe('POST /questions', () => {
    it('should create a new question and return 201 status', async () => {
      const newQuestion = {
        text: "What is the capital of France?",
        options: [
          { text: "Paris", isCorrect: true },
          { text: "London", isCorrect: false },
          { text: "Madrid", isCorrect: false }
        ],
        level: 1
      };

      const response = await request(app)
        .post('/questions') // Asegúrate de que este path coincida con cómo has montado tus rutas en Express
        .send(newQuestion);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('text', newQuestion.text);
      // Agrega más expectativas según sea necesario para verificar la respuesta completa
    });
  });

});