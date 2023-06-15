const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { auth } = require('../middlwares/auth');

router.use(auth);
router.get('/cards', cardsController.getCards);
router.post('/cards', cardsController.createCard);
router.delete('/cards/:_id', cardsController.deleteCard);
router.put('/cards/:_id/likes', cardsController.likeCard);
router.delete('/cards/:_id/likes', cardsController.deleteLike);

module.exports = router;
