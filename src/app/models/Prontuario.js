const mongoose = require('../../database');
const ProntuarioSchema = new mongoose.Schema({
    cpfNumber: {
        type: String,
        require: true,
    },
    cpfNumberPatient: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
    }
});
const Agenda = mongoose.model('prontuario', ProntuarioSchema);
module.exports = Agenda;