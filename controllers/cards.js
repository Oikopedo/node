/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

module.exports.getCards = (_, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((data) => {
      if (data.ok !== 1) {
        res.status(500).send({ message: 'Internal Server Error' });
        return;
      }
      if (data.deletedCount === 1) {
        res.status(200);
      } else {
        res.status(404).send({ message: `Card with id ${req.params.cardId} not found` });
      }
    }).catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate('owner').populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Card with id ${req.params.cardId} not found` });
      }
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).populate('owner').populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Card with id ${req.params.cardId} not found` });
      }
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};
