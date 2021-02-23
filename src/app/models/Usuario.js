const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const UsuarioSchema = new mongoose.Schema({
    cpfNumber: {
        type: String,
        require: true,
        unique: true,
    },
    cpfImages: {
        type: String,
    },
    firstName: {
        type: String,
        require: true,
    },
    familyName: {
        type: String,
        require: true,
    },
    socialName: {
        type: String,
    },
    title: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
    },
    senha: {
        type: String,
        require: true,
        select: false,
    },
    rgNumber: {
        type: String,
    },
    rgExpedition: {
        type: String,
    },
    rgExpeditor: {
        type: String,
    },
    rgExpeditorUf: {
        type: String,
    },
    rgImages: {
        type: String,
    },
    address: [{
        endZIP: {
            type: String,
            require: true,
        },
        endState: {
            type: String,
            require: true,
        },
        endCity: {
            type: String,
            require: true,
        },
        endDistrict: {
            type: String,
            require: true,
        },
        endDirection: {
            type: String,
            require: true,
        },
        endComplement: {
            type: String,
        },
    }],

    telefones: [{
        numero: { type: String },
        tipo: { type: String }
    }],
    ehMedico: {
        type: Boolean,
        require: true,
    },
    ativo: {
        type: Boolean,
        require: true,
    },
    planoSaude: [{
        numero: { type: String },
        tipo: { type: String },
        plano: { type: String },
        operadora: { type: String },
        imagem: { type: String },
    }],
    responsavel: [{
        nome: { type: String },
        contato: { type: String },
        grauParentesco: { type: String },
    }],
    conselho: {
        type: String
    },
    ufConselho: {
        type: String
    },
    registro: {
        type: String
    },
    especialidade: {
        type: String
    },
    tokenResetSenha: {
        type: String,
        select: false,
    },
    tokenResetExpiresSenha: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
UsuarioSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash;
    next();
})
UsuarioSchema.pre('findOneAndUpdate', async function () {
    const userToUpdate = await this.model.findOne(this.getQuery())

    if (userToUpdate.senha !== this._update.senha) {
        const novaSenha = await bcrypt.hash(this._update.senha, 10)
        this._update.senha = novaSenha
    }
})
const User = mongoose.model('Usuario', UsuarioSchema);
module.exports = User;