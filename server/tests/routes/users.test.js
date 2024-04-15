const request = require('supertest');
const app = require('../../src/index'); // Ajusta la ruta según la ubicación real de tu archivo index.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { UserModel } = require('../../src/models/Users'); // Ruta actualizada para UserModel

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('/auth/register and /auth/login', () => {
  // ... tus pruebas de registro aquí ...

  it('should not log in with incorrect username', async () => {
    const userData = {
      username: 'testUser',
      password: 'testPass'
    };

    // Aquí no creamos el usuario primero, por lo que debería dar un 404
    const response = await request(app)
      .post('/auth/login')
      .send(userData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should not log in with incorrect password', async () => {
    const userData = {
      username: 'testUser',
      password: 'testPass'
    };

    // Primero crea el usuario
    await request(app)
      .post('/auth/register')
      .send(userData);

    // Luego intenta iniciar sesión con una contraseña incorrecta
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: userData.username,
        password: 'wrongPassword'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

});

