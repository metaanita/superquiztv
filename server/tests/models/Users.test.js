const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { UserModel } = require('../../src/models/Users'); // Ajusta la ruta según sea necesario

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

describe('User Model Test', () => {
  it('can create a new user', async () => {
    const userData = {
      username: 'testUser',
      password: 'password123',
      savedQuestions: [],
    };

    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    // Verifica que el ID se defina cuando MongoDB crea el nuevo registro
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
  });

  // Agrega más tests según sea necesario
});
