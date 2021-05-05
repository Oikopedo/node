const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (_, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((data) => {
      if (data.ok !== 1) {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
        return;
      }
      if (data.deletedCount === 1) {
        res.send({ message: 'Карта успешно удалена' });
      } else {
        res.status(404).send({ message: `Карта с id ${req.params.cardId} не найдена!` });
      }
    }).catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Передан некорректный идентификатор ${req.params.cardId}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate('owner').populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Карта с id ${req.params.cardId} не найдена!` });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        if (err.path === '_id') {
          res.status(400).send({ message: `Передан некорректный идентификатор ${req.params.cardId}` });
        } else {
          res.status(400).send({ message: `Передан некорректный идентификатор ${_id}` });
        }
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  ).populate('owner').populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Карта с id ${req.params.cardId} не найдена!` });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        if (err.path === '_id') {
          res.status(400).send({ message: `Передан некорректный идентификатор ${req.params.cardId}` });
        } else {
          res.status(400).send({ message: `Передан некорректный идентификатор ${_id}` });
        }
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
