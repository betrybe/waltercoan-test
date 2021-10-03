/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const authService = require('./authService');
const config = require('../config');

const dbCollection = 'recipes';

async function dbConnect() {
    const client = new MongoClient(config.db.MONGO_DB_URL);
    await client.connect();
    const db = client.db(config.db.DB_NAME);
    return db;
}

exports.insertNew = async function insertNew(recipe) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, _reject) => {
        collection.insertOne(recipe).then(({ ops }) => {
            resolve({
                result: ops[0],
            });
        });
    });
};

exports.getAll = async function getAll() {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, _reject) => {
        collection.find({}, (err, documents) => {
            resolve(documents.toArray());
        });
    });
};

exports.getById = async function getById(id) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, reject) => {
        const hex = /[0-9A-Fa-f]{6}/g;
        const idDoc = (hex.test(id)) ? ObjectID(id) : id;
        collection.findOne({ _id: idDoc }, (err, document) => {
            if (document == null) {
                reject(new Error('recipe not found'));
            }
            resolve(document);
        });
    });
};
// eslint-disable-next-line max-lines-per-function
exports.update = async function update(id, recipe, userId) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, reject) => {
        const hex = /[0-9A-Fa-f]{6}/g;
        const idDoc = (hex.test(id)) ? ObjectID(id) : id;
        let filter = { _id: idDoc, userId };
        authService.isAdminUser(userId).then((response) => {
            if (response === true) filter = { _id: idDoc };
        }).then(() => {
            delete recipe._id;
            delete recipe.userId;
            collection.updateOne(filter, { $set: recipe }, { }).then((doc) => {
                if (doc.modifiedCount > 0) {
                    this.getById(id).then((alterRecipe) => resolve(alterRecipe));
                } else {
                    reject(new Error('recipe not found'));
                }
            });
        });
    });
};
exports.delete = async function deleteRecipe(id, userId) {
    const dbClient = await dbConnect();
    const collection = dbClient.collection(dbCollection);
    return new Promise((resolve, _reject) => {
        const hex = /[0-9A-Fa-f]{6}/g;
        const idDoc = (hex.test(id)) ? ObjectID(id) : id;
        let filter = { _id: idDoc, userId };
        authService.isAdminUser(userId).then((response) => {
            if (response === true) filter = { _id: idDoc };
        }).then(() => {
            collection.deleteOne(filter).then((_doc) => {
                resolve();
            });
        });
    });
};