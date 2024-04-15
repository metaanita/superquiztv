const request = require('supertest');
const app = require('../../src/index'); // Asegúrate de que la ruta sea correcta

describe('Application Startup', () => {
  it('should respond to /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404); // Asumiendo que no tienes una ruta raíz y esperarías un 404
  });

  // Si tienes una ruta raíz configurada, cambia el código de estado esperado
  // y la URL en el test anterior como sea necesario

  // Otras pruebas para confirmar que los sub-sistemas están funcionando podrían ir aquí
  // Por ejemplo, una solicitud a /auth/register y /questions para confirmar que esas rutas están cargadas
});
