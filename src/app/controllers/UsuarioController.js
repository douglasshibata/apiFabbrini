const User = require('../models/Usuario');
const { cpf } = require('cpf-cnpj-validator');
// Validador de Senha
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
const authMiddleware = require('../middlewares/auth');

module.exports = {
    async store(req, res) {
        const { cpfNumber, senha, firstName, email } = req.body;
        try {
            if (!cpf.isValid(cpfNumber)) {
                return res
                    .status(400)
                    .send({ message: { error: 'CPF inválido' } })
            }
            if (await User.findOne({ cpfNumber })) {
                return res
                    .status(400)
                    .send({ message: { error: 'CPF Já Cadastrado' } })
            }
            if (await User.findOne({ email })) {
                return res
                    .status(400)
                    .send({ message: { error: 'Email Já Cadastrado' } })
            }
            if (/\d/.test(firstName)) {
                return res
                    .status(400)
                    .send({ message: { error: 'Nome não pode conter números' } })
            }
            if (firstName > 5) {
                return res
                    .status(400)
                    .send({ message: { error: 'Nome não pode ter menos que 5 caracteres ' } })
            }
            schema
                .is().min(8)                                    // Minimum length 8
                .is().max(100)                                  // Maximum length 100
                .has().uppercase([1])                           // Must have uppercase letters
                .has().lowercase()                              // Must have lowercase letters
                .has().digits(2)                                // Must have at least 2 digits
                .has().symbols([1])
                .has().not().spaces()                           // Should not have spaces
                .is().not().oneOf(['Passw0rd', 'Password123', '12345', 'senha']); // Blacklist these values
            if (!schema.validate(senha)) {
                return res
                    .status(400)
                    .send({ message: { error: 'Senha Fraca, deve ter no mínimo 8 caracteres tem que ter no mínimo 1 letra Maiuscula Dois Digitos Sem espaço' } })
            }
            const user = await User.create(req.body);
            user.senha = undefined;
            return res.send({ user })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update(req, res) {
        //const { cpfImages} = req.file
        const { _id } = req.headers
        const { cpfNumber, senha, firstName } = req.body;
        try {
            if (!cpf.isValid(cpfNumber)) {
                return res
                    .status(400)
                    .send({ message: { error: 'CPF inválido' } })
            }
            if (!await User.findOne({ cpfNumber })) {
                return res
                    .status(400)
                    .send({ message: { error: 'CPF não Cadastrado' } })
            }
          
            if (/\d/.test(firstName)) {
                return res
                    .status(400)
                    .send({ message: { error: 'Nome não pode conter números' } })
            }
            schema
                .is().min(8)                                    // Minimum length 8
                .is().max(100)                                  // Maximum length 100
                .has().uppercase([1])                           // Must have uppercase letters
                .has().lowercase()                              // Must have lowercase letters
                .has().digits(2)                                // Must have at least 2 digits
                .has().symbols([1])
                .has().not().spaces()                           // Should not have spaces
                .is().not().oneOf(['Passw0rd', 'Password123', '12345', 'senha']); // Blacklist these values
            if (!schema.validate(senha)) {
                return res
                    .status(400)
                    .send({ message: { error: 'Senha Fraca, deve ter no mínimo 8 caracteres tem que ter no mínimo 1 letra Maiuscula Dois Digitos Sem espaço' } })
            }
            const user = await User.findOneAndUpdate({_id},req.body);
            return res.status(201).send({user})
        } catch (error) {
            console.log(error);
            return res.status(400).send(error)
        }
    },
    async show(req, res) {
        const { _id } = req.headers;
        try {
            const user = await User.findOne({ _id });
            if (!user) {
                return res.status(400).send({ error: { message: "Usuário Não encontrado" } })
            }
            return res.send({ user })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async index(req, res) {
        try {
            const user = await User.find();
            
            return res.send({ user })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
}    