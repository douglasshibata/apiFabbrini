const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const routes = express.Router();
const upload = multer(uploadConfig);

const UsuarioController = require('./app/controllers/UsuarioController');
const SessionController = require('./app/controllers/SessionController');
const ForgotPasswordController = require('./app/controllers/ForgotPasswordController');
const ResetPasswordController = require('./app/controllers/ResetPasswordController');
const AgendaController = require('./app/controllers/AgendaController');
const auth = require('./app/middlewares/auth');

routes.post('/user',UsuarioController.store);
routes.put('/user',auth,upload.single('cpfImages'),UsuarioController.update);
routes.get('/user',auth,UsuarioController.index);
routes.get('/perfil',auth,UsuarioController.show);

routes.post('/sessions',SessionController.store);
routes.post('/forgot-password',ForgotPasswordController.store);
routes.post('/reset-password',ResetPasswordController.store);

routes.post('/agenda',auth,AgendaController.store);
//routes.get('/agenda',auth,AgendaController.index);
routes.get('/agendaProfissional',auth,AgendaController.agendaProfissional);
routes.get('/agendaPaciente',auth,AgendaController.agendaPaciente);

module.exports = routes;