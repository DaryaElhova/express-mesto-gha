const cardSchema = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const handleErrors = (res, err) => {
  res.status(INTERNAL_SERVER_ERROR).send({
    message: 'Internal Server Error',
    stack: err.stack,
  });
};

const validationErrors = (res, err) => {
  res.status(BAD_REQUEST).send({
    message: 'Invalid data',
    stack: err.stack,
  });
};

const getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => {
      if (!cards) {
        throw new Error('Cards Not Found');
      }
      res.send(cards);
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // обязательно предоставить данные для owner
  cardSchema
    .create({
      name,
      link,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

const deleteCard = (req, res) => {
  cardSchema
    .findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: 'Card Not Found',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

const likeCard = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: 'Card Not Found',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

const deleteLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: 'Card Not Found',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
