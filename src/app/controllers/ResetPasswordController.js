const User = require('../models/Usuario');

var passwordValidator = require('password-validator');
var schema = new passwordValidator();
module.exports = {
    async store(req, res) {
        const { tokenResetSenha, senha ,email} = req.body;
        try {
            const user = await User.findOne({ email }).select('+tokenResetSenha tokenResetExpiresSenha');
            if (!user) {
                return res.status(400).send({ error: "Usuário Não encontrado" } )
            }
            if (tokenResetSenha !== user.tokenResetSenha) {
                return res.status(400).send({ error:  "Token inválido" } )
            }
            const horaAtual = new Date();
            if (horaAtual > user.tokenResetExpiresSenha) {
                return res.status(400).send({ error:  "Token expirado, gere outro" } )
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
                    .send({ error: 'Senha Fraca, deve ter no mínimo 8 caracteres tem que ter no mínimo 1 letra Maiuscula Dois Digitos Sem espaço' } )
            }
            user.senha = senha;
            await user.save();
            return res.status(200).send({ message: "Atualizado com sucesso" })
        } catch (error) {
            console.log(error);
            return res.status(400).send({ error: "Erro em resetar a senha, tente novamente" })
        }
    },
}
