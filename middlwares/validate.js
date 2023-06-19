const { celebrate, Joi } = require('celebrate');

const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z]{2,}[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+?#?$/;

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regex),
  }),
});

module.exports = {
  validateAuth,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCreateCard,
  validateId,

};
