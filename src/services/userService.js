/* eslint-disable sonarjs/cognitive-complexity */
const { MongoClient, ObjectID } = require('mongodb');
const config = require('../config');

const dbCollection = 'users';

async function dbConnect() {
    const client = new MongoClient(config.db.MONGO_DB_URL);
    await client.connect();
    const db = client.db(config.db.DB_NAME);
    return db;
}
exports.getAll = async function getAll() {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, _reject) => {
        collection.find({}, (_err, documents) => {
            resolve(documents.toArray());
        });
    });
};
exports.getById = async function getById(id) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, _reject) => {
        const hex = /[0-9A-Fa-f]{6}/g;
        const idDoc = (hex.test(id)) ? ObjectID(id) : id;
        collection.findOne({ _id: idDoc }, (_err, document) => {
            resolve(document);
        });
    });
};
// eslint-disable-next-line max-lines-per-function
exports.insertNew = async function insertNew(user, userLoggedId) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    // eslint-disable-next-line max-lines-per-function
    return new Promise((resolve, reject) => {
        if (user.role === 'admin') {
            const hex = /[0-9A-Fa-f]{6}/g;
            // eslint-disable-next-line no-param-reassign
            const userLoggedIdFilter = (hex.test(userLoggedId)) ? ObjectID(userLoggedId) 
                : userLoggedId;
            collection.findOne({ _id: userLoggedIdFilter }, (_err, document) => {
                if (document == null || document.role !== 'admin') {
                    reject(new Error('Only admins can register new admins'));
                }
            });
        }
        collection.findOne({ email: user.email }, (_err, document) => {
            if (document != null) {
                reject(new Error('Email already registered'));
            } else {
                collection.insertOne(user).then(({ ops }) => {
                    resolve({
                        result: ops[0],
                    });
                });
            }
        });
    });
};
exports.validateUser = async function validateUser(userAuth) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, reject) => {
        collection.findOne({ email: userAuth.email, password: userAuth.password }, 
            (_err, document) => {
            if (document == null) {
                reject(new Error('Incorrect username or password'));
            }
            resolve(document);
        });
    });
};
