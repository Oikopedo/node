const mongoose = require('mongoose');
const MestoError = require('../errors/MestoError');

module.exports = (res, err) => {
  if (err instanceof MestoError) {
    switch (err.code) {
      case 500:
        return res.status(500).send({ message: 'На сервере произошла ошибка' });
      case 404:
        return res.status(404).send({ message: err.message });
      case 401:
        return res.status(401).send({ message: 'Неправильный email или пароль' });
      default:
        return res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: err.message });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({ message: err.message });
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).send({ message: 'Skata' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};
