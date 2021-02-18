const User = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = {
    async store(req, res) {
        const {cpfNumber,senha} = req.body;
        try {
            const user = await User.findOne({cpfNumber}).select("+senha");
            if(!user){
                return res.status(400).send({error:{message:"Usuário Não encontrado"}})
            }
            if(!await bcrypt.compare(senha,user.senha)){
                return res.status(400).send({error:{message:"Senha inválida"}})
            }
            user.senha = undefined;
            const token = jwt.sign({_id:user.id},authConfig.secret,{
                expiresIn:86400,
            });
            return res.send({ user,token })
        } catch (error) {
            return res.status(400).send(error)
        }
    },
}
