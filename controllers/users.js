const userSchema = require('../models/user');

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
    message: 'Invalid Data',
    stack: err.stack,
  });
};

const getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

const getUserById = (req, res) => {
  userSchema
    .findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'User Not Found',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userSchema
    .create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

const updateUser = (req, res) => {
  userSchema
    .findByIdAndUpdate(req.user._id, {
      ...req.body,
    }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return validationErrors(res, err);
      }

      return handleErrors(res, err);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  userSchema
    .findByIdAndUpdate(req.user._id, {
      avatar,
    }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return validationErrors(res, err);
      }
      return handleErrors(res, err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
