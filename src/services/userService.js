const { MongoClient } = require('mongodb');
const config = require('../config');

const dbCollection = 'users';

async function dbConnect() {
    const client = new MongoClient(config.db.MONGO_DB_URL);
    await client.connect();
    const db = client.db(config.db.DB_NAME);
    return db;
}
exports.getAll = async function () {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    const findResult = await collection.find({}).toArray();
    return findResult;
};
exports.insertNew = async function (user) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, reject) => {
        collection.findOne({ email: user.email }, (err, document) => {
            if (document != null) {
                reject(new Error('Email already registered'));
            }
        });
        collection.insertOne(user).then(({ ops }) => {
            resolve({
                result: ops[0],
            });
        });
    });
};
exports.validateUser = async function (userAuth) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, reject) => {
        collection.findOne({ email: userAuth.email, password: userAuth.password  }, (err, document) => {
            if (document == null) {
                reject(new Error('Incorrect username or password'));
            }
            resolve(document);
        });
    });
};
