const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => {
    console.log('Connecting...');
  })
  .catch((err) => {
    console.log(`Ошибка ${err.message}`);
  });

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64750ea3e9498313e85691a1',
  };

  next();
});

app.use(cardRouter);
app.use(userRouter);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
