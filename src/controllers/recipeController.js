const recipeService = require('../services/recipeService');
const { Recipe } = require('../models/recipe');

exports.insertNew = async function (req, res) {
    const newRecipe = new Recipe();
    try {
        newRecipe.fill(req.body);
        newRecipe.userId = req.userId;
        await recipeService.insertNew(newRecipe).then((response) => {
            res.status(201);
            res.send({ user: response.result }).end();    
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(409).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};
exports.getAll = function (req, res) {
    recipeService.getAll().then((response) => {
        res.status(200);
        res.send(response);
    });
};
exports.getById = function (req, res) {
    recipeService.getById(req.params.id).then((response) => {
        res.status(200);
        res.send(response);
    }).catch((error) => {
        res.statusMessage = error.toString();
        res.status(404).send({ message: error.message });
    });
};