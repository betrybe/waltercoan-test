const recipeService = require('../services/recipeService');
const { Recipe } = require('../models/recipe');

exports.insertNew = async function insertNew(req, res) {
    const newRecipe = new Recipe();
    try {
        newRecipe.fill(req.body);
        newRecipe.userId = req.userId;
        await recipeService.insertNew(newRecipe).then((response) => {
            res.status(201);
            res.send({ recipe: response.result }).end();    
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(409).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};
exports.getAll = function getAll(req, res) {
    recipeService.getAll().then((response) => {
        res.status(200);
        res.send(response);
    });
};
exports.getById = function getById(req, res) {
    recipeService.getById(req.params.id).then((response) => {
        res.status(200);
        res.send(response);
    }).catch((error) => {
        res.statusMessage = error.toString();
        res.status(404).send({ message: error.message });
    });
};
exports.update = async function update(req, res) {
    const updateRecipe = new Recipe();
    try {
        updateRecipe.fill(req.body);
        await recipeService.update(req.params.id, updateRecipe, req.userId).then((response) => {
            res.status(200);
            res.send(response).end();    
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(401).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};
exports.delete = async function deleteRecipe(req, res) {
    try {
        await recipeService.delete(req.params.id, req.userId).then((response) => {
            res.status(204);
            res.send(response).end();    
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(401).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};
exports.updateImage = async function updateImage(req, res) {
    try {
        const recipeImage = { image: `localhost:3000/src/uploads/${req.file.filename}` };
        await recipeService.update(req.params.id, recipeImage, req.userId).then((response) => {
            res.status(200);
            res.send(response).end();                    
        }).catch((error) => {
            res.status(401).send({ message: error.message });
        });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
};

exports.downloadImage = async function downloadImage(req, res) {
    res.status(200).sendFile(`/images${req.params.imagefile}`);
};