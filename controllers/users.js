const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: `Пользователь с id ${req.params.userId} не найден!` });
      }
    }).catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Передан некорректный идентификатор ${req.params.userId}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateMe = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate(req.user, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Такого профиля нет в базе данных!' });
      }
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Передан некорректный идентификатор ${_id}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateMyAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate(req.user, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Такого профиля нет в базе данных!' });
      }
    }).catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Передан некорректный идентификатор ${_id}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
