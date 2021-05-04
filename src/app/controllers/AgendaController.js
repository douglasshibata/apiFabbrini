const User = require('../models/Usuario');
const Agenda = require('../models/Agenda');

module.exports = {
  async store(req, res) {
    const { cpfNumber, cpfNumberPaciente, horario } = req.body;
    try {
      const profissional = await User.findOne({ cpfNumber });
      if (!profissional) {
        return res
          .status(400)
          .send({ message: { error: 'Profissional não encontrado' } });
      }
      if (!profissional.ehMedico) {
        return res
          .status(400)
          .send({ message: { error: 'Não possui permissão de profissional para cadastrar' } });
      }
      const paciente = await User.findOne({ cpfNumber: cpfNumberPaciente });
      if (!paciente) {
        return res
          .status(400)
          .send({ message: { error: 'Paciente não encontrado' } });
      }
      const horaAtual = new Date();
      const horaMarcada = new Date(horario);
      if (horaMarcada <= horaAtual) {
        return res
          .status(400)
          .send({ message: { error: 'Hora inválida, horário não pode ser antes do dia atual' } });
      }

      const agenda = await Agenda.create({ ...req.body, usuarioProfissional: profissional._id, usuarioPaciente: paciente._id });
      return res.send({ agenda });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
  async update(req, res) {
    // const { cpfImages} = req.file
    const { _id } = req.headers;
    const { cpfNumber, senha, firstName } = req.body;
    try {
      if (!cpf.isValid(cpfNumber)) {
        return res
          .status(400)
          .send({ message: { error: 'CPF inválido' } });
      }
      if (!await User.findOne({ cpfNumber })) {
        return res
          .status(400)
          .send({ message: { error: 'CPF não Cadastrado' } });
      }

      const user = await User.findOneAndUpdate({ _id }, req.body);
      return res.status(201).send({ user });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
  async agendaPaciente(req, res) {
    const { _id } = req.headers;
    try {
      const agenda = await Agenda.find({ usuarioPaciente: _id });
      const paciente = await User.findOne({ _id });
      if (!agenda) {
        return res.status(400).send({ error: { message: 'Agenda Não encontrado' } });
      }
      return res.send({ agenda, paciente });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
  async agendaProfissional(req, res) {
    const { _id } = req.headers;
    try {
      const agenda = await Agenda.find({ usuarioProfissional: _id });
      // const usuarioProfissional = await User.find({ _id })
      // const usuarioPaciente = await User.findById({ _id: agenda[0].usuarioPaciente })
      if (!agenda) {
        return res.status(400).send({ error: { message: 'Agenda Não encontrado' } });
      }
      return res.send({ agenda });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
  async index(req, res) {
    try {
      const user = await Agenda.find();

      return res.send({ user });
    } catch (error) {
      return res.status(400).send({ message: { error: 'Algo deu Errado, entre em contato com o departamento de TI' } });
    }
  },
};
