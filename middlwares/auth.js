const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/errors-constructor/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Проверяем что заголовок есть и он содержит Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  // извлекаем токен из заголовка
  const token = authorization.replace('Bearer ', '');

  let payload;
  // verify проверяет токен
  try {
    payload = jwt.verify(token, 'secret-key', { expiresIn: '7d' });
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;

  return next();
};

module.exports = {
  auth,
};
