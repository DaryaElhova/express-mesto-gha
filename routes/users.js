const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/users', usersController.getUser);
router.get('/users/:_id', usersController.getUserById);
router.post('/users', usersController.createUser);
router.patch('/users/me', usersController.updateUser);
router.patch('/users/me/avatar', usersController.updateAvatar);

module.exports = router;