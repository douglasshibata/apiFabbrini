const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Usuario');
// eslint-disable-next-line no-undef
const { env } = process;
module.exports = {
  async store(req, res) {
    const { cpfNumber, senha } = req.body;
    try {
      const user = await User.findOne({ cpfNumber }).select('+senha');
      if (!user) {
        return res.status(400).send({ error: { message: 'Usuário Não encontrado' } });
      }
      if (!await bcrypt.compare(senha, user.senha)) {
        return res.status(400).send({ error: { message: 'Senha inválida' } });
      }
      user.senha = undefined;
      const token = jwt.sign({ _id: user.id }, env.secret, {
        expiresIn: 86400,
      });
      return res.send({ user, token });
    } catch (error) {
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
};
