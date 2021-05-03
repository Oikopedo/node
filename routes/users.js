const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateMe,
  updateMyAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateMyAvatar);

module.exports = router;
