const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const app = express();
const task = require('./modules/cron');
const notify = require('./modules/notifyEmail');

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(routes);
task.start();
notify.start();

app.listen(PORT, () => console.log(`Rodando na Porta ${PORT}`));