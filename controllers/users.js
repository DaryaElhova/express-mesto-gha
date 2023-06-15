const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
// const user = require('../models/user');

const BadRequest = require('../utils/errors-constructor/BadRequest');
const NotFound = require('../utils/errors-constructor/NotFound');
const Unauthorized = require('../utils/errors-constructor/Unauthorized');

const OK = 200;

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  userSchema
    .findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Введенные данные некорректны');
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Такой пользователь не найден');
      } else { res.send(user); }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => {
      userSchema
        .create({
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
          email: req.body.email,
          password: hash,
        })
        .then((newUser) => {
          res.send(newUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequest('Введены некорректные данные');
          }
          next(err);
        });
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  userSchema
    .findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта илии пароль'));
      }
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      if (!isEqual) {
        return Promise.reject(new Error('Неправильная почта илии пароль'));
      }

      const token = jwt.sign({ _id: user._id }, 'secret-key');
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        throw new Unauthorized('Ошибка авторизации');
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  userSchema
    .findByIdAndUpdate(req.user._id, {
      ...req.body,
    }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Такой пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Введенные данные некорректны');
      }

      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userSchema
    .findByIdAndUpdate(req.user._id, {
      avatar,
    }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Такой пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Введенные данные некорректны');
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  loginUser,
  getUser,
};
