const cardSchema = require('../models/card');

const BadRequest = require('../utils/errors-constructor/BadRequest');
const NotFound = require('../utils/errors-constructor/NotFound');
const Forbidden = require('../utils/errors-constructor/Forbidden');

const { SUCCESS_CREATED } = require('../utils/constants');

const getCards = (req, res, next) => {
  cardSchema
    .find({})
    .select('-__v')
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  // обязательно предоставить данные для owner
  cardSchema
    .create({
      name,
      link,
      owner: req.user._id,
    })
    .then((card) => {
      res.status(SUCCESS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardSchema
    .findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найденна');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('У вас нет прав доступа');
      }
      return cardSchema.findByIdAndDelete(req.params._id)
        .orFail(() => new NotFound('Карточка не найдена'))
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Некорректные данные');
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найденна');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Некорректные данные');
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найденна');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Некорректные данные');
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
