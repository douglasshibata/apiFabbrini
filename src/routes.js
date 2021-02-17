const express = require('express');
const routes = express.Router();
const UsuarioController = require('./controllers/UsuarioController');

routes.post('/user',UsuarioController.store);


module.exports = routes;