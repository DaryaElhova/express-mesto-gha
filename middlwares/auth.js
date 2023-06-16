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
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

module.exports = {
  auth,
};
