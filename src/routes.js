const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);

const UsuarioController = require('./app/controllers/UsuarioController');
const SessionController = require('./app/controllers/SessionController');
const auth = require('./app/middlewares/auth');

routes.post('/user',UsuarioController.store);
routes.put('/user',auth,upload.single('cpfImages'),UsuarioController.update);
routes.get('/user',auth,UsuarioController.index);
routes.get('/perfil',auth,UsuarioController.show);

routes.post('/sessions',SessionController.store);

module.exports = routes;