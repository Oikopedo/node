const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../middleware/handleError');
const MestoError = require('../errors/MestoError');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => handleError(res, new MestoError()));
};

function getUserById(res, _id) {
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, `Пользователь с id ${_id} не найден!`));
      }
      return res.send({ data: user });
    }).catch((err) => handleError(res, err));
}

module.exports.getUser = (req, res) => {
  getUserById(res, req.params.userId);
};

module.exports.getMe = (req, res) => {
  getUserById(res, req.user);
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => {
        user.set('password', undefined);
        res.send({ data: user });
      }))
    .catch((err) => handleError(res, err));
};

module.exports.updateMe = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate(req.user, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, 'Такого профиля нет в базе данных!'));
      }
      return res.send({ data: user });
    }).catch((err) => handleError(res, err));
};

module.exports.updateMyAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(req.user, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(404, 'Такого профиля нет в базе данных!'));
      }
      return res.send({ data: user });
    }).catch((err) => handleError(res, err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new MestoError(401));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new MestoError(401));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => handleError(res, err));
};
