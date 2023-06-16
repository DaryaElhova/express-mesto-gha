const router = require('express').Router();
const usersController = require('../controllers/users');
const { auth } = require('../middlwares/auth');

router.use(auth);
router.get('/users', usersController.getUsers);
router.get('/users/me', usersController.getCurrentUser);
router.get('/users/:_id', usersController.getUserById);
router.patch('/users/me', usersController.updateUser);
router.patch('/users/me/avatar', usersController.updateAvatar);

module.exports = router;
