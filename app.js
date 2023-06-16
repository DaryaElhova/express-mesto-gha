const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { loginUser, createUser } = require('./controllers/users');
const { validateAuth, validateCreateUser } = require('./middlwares/validate');

const NOT_FOUND = 404;

mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => {
    console.log('Connecting...');
  })
  .catch((err) => {
    console.log(`Ошибка ${err.message}`);
  });

const app = express();
app.use(express.json());

app.post('/signin', validateAuth, loginUser);
app.post('/signup', validateCreateUser, createUser);
app.use(cardRouter);
app.use(userRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
