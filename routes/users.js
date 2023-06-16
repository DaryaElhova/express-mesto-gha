const router = require('express').Router();
const usersController = require('../controllers/users');
const { auth } = require('../middlwares/auth');
const { validateUpdateUser, validateUpdateAvatar } = require('../middlwares/validate');

router.use(auth);
router.get('/users', usersController.getUsers);
router.get('/users/me', usersController.getCurrentUser);
router.get('/users/:_id', usersController.getUserById);
router.patch('/users/me', validateUpdateUser, usersController.updateUser);
router.patch('/users/me/avatar', validateUpdateAvatar, usersController.updateAvatar);

module.exports = router;
