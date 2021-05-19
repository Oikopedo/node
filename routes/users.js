const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateMe,
  updateMyAvatar,
  getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateMyAvatar);

module.exports = router;
