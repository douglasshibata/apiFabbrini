const mongoose = require('mongoose');
require('dotenv').config()
if(process.env.AMBIENTE == 'dev'){
    mongoose.connect(`${process.env.DB_CONNECTION}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`, 
   { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true })
}else{
    mongoose.connect(`${process.env.MONGO_URL}`,{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true })
}
mongoose.Promise = global.Promise;
module.exports = mongoose;