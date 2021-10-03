const express = require('express');
const path = require('path');
var multer = require("multer")
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const recipeController = require('../controllers/recipeController');
const authService = require('../services/authService');

const router = express.Router();
const app = express();
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + ".jpeg")
  }
})
var upload = multer({ storage: storage })
router.use(authService.checkToken);
router.get('/users', userController.getAll);
router.post('/users/admin', userController.insertNewAdmin);
router.post('/users', userController.insertNew);
router.post('/login', loginController.login);
router.post('/recipes', recipeController.insertNew);
router.get('/images/:imagefile', recipeController.downloadImage);
router.put('/recipes/:id/image', upload.single('image'), recipeController.updateImage);
router.get('/recipes/:id', recipeController.getById);
router.put('/recipes/:id', recipeController.update);
router.delete('/recipes/:id', recipeController.delete);
router.get('/recipes', recipeController.getAll);
app.use('/', router);

module.exports = app;