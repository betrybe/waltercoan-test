const { MongoClient } = require('mongodb');
const config = require('./src/config');

async function dbConnect() {
    const client = new MongoClient(config.db.MONGO_DB_URL);
    await client.connect();
    const db = client.db(config.db.DB_NAME);
    return db;
}

const db = await dbConnect();
db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });
