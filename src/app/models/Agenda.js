const mongoose = require('../../database');
const AgendaSchema = new mongoose.Schema({
    cpfNumber: {
        type: String,
        require: true,
    },
    cpfNumberPaciente: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    usuarioProfissional:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
    },
    usuarioPaciente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
    },
    horario:{
        type:Date,
    }
});
const Agenda = mongoose.model('agenda', AgendaSchema);
module.exports = Agenda;
//https://www.youtube.com/watch?v=GAZdUyIV3ms