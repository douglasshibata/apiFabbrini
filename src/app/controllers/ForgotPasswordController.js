const User = require('../models/Usuario');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
module.exports = {
    async store(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).send({ error: { message: "Usuário Não encontrado" } })
            }
            const token = crypto.randomBytes(20).toString('hex');
            const horaAtual = new Date();
            horaAtual.setHours(horaAtual.getHours() + 1);
            const app_url = process.env.FRONT_URL;
            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    tokenResetSenha: token,
                    tokenResetExpiresSenha: horaAtual,
                }
            });
            mailer.sendMail({
                to: email,
                from: process.env.MAIL_USER,
                template: "forgot_password",
                subject:"Recuperação de senha",
                context: { token,app_url }
            }, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: { message: "Erro ao enviar o email" } })
                }
                return res.status(200).send({message:'Email enviado com sucesso'})
            })
            //return res.send({ user })
        } catch (error) {
            return res.status(400).send({ error: "Erro em resetar a senha, tente novamente" })
        }
    },
}
