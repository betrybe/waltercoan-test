const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const url = 'http://localhost:3000';

describe('teste1', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(mongoDbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        db = connection.db('Cookmaster');
    });
    beforeEach(async () => {
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = {
        name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' };
    await db.collection('users').insertOne(users);
    });

    afterAll(async () => {
    await connection.close();
    });

    it('Será validado que o campo "name" é obrigatório', async () => {
        await frisby
          .post(`${url}/users/`,
            {
              email: 'zezinho@gmail.com',
              password: '666',
            })
          .expect('status', 400)
          .then((response) => {
            const { body } = response;
            const result = JSON.parse(body);
            expect(result.message).toBe('Invalid entries. Try again.');
          });
      });
});
