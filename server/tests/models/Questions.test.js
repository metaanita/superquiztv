const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { QuestionModel } = require('../../src/models/Questions');

let mongoServer;

// Iniciar el servidor de MongoDB en memoria antes de todos los tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}, 60000); // Incrementa el timeout para dar tiempo a la base de datos en memoria para iniciar

// Limpiar los datos después de cada test
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
}, 30000); // Incrementa el timeout si es necesario

// Desconectar de la base de datos y detener el servidor en memoria después de todos los tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
}, 30000); // Incrementa el timeout si es necesario

describe('QuestionModel', () => {
  it('should be defined', () => {
    expect(QuestionModel).toBeDefined();
  });

  it('can create a question with options', async () => {
    const questionData = {
      text: 'What is the capital of France?',
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'London', isCorrect: false },
        { text: 'Madrid', isCorrect: false }
      ],
      level: 1
    };

    const question = new QuestionModel(questionData);
    await question.save();

    const foundQuestion = await QuestionModel.findOne({ text: 'What is the capital of France?' });
    expect(foundQuestion).toBeDefined();
    expect(foundQuestion.text).toBe(questionData.text);
    expect(foundQuestion.options.length).toBe(3);
    expect(foundQuestion.level).toBe(questionData.level);
  });
});
