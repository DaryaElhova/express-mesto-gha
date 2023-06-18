const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { auth } = require('../middlwares/auth');
const { validateCreateCard, validateId } = require('../middlwares/validate');

router.use(auth);
router.get('/cards', cardsController.getCards);
router.post('/cards', validateCreateCard, cardsController.createCard);
router.delete('/cards/:_id', validateId, cardsController.deleteCard);
router.put('/cards/:_id/likes', validateId, cardsController.likeCard);
router.delete('/cards/:_id/likes', validateId, cardsController.deleteLike);

module.exports = router;
