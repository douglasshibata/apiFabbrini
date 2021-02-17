const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(`${process.env.DB_CONNECTION}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`, 
{ useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise;
module.exports = mongoose;