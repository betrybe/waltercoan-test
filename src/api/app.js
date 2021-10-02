const express = require('express');
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const recipeController = require('../controllers/recipeController');
const authService = require('../services/authService');

const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

router.use(authService.checkToken);
router.get('/users', userController.getAll);
router.post('/users', userController.insertNew);
router.post('/login', loginController.login);
router.post('/recipes', recipeController.insertNew);
router.get('/recipes/:id', recipeController.getById);
router.get('/recipes', recipeController.getAll);
app.use('/', router);

module.exports = app;