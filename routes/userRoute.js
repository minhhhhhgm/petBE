const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  followUser,
  deleteAllFollowRelations
} = require('../controllers/userController');

const router = express.Router();

router.post('/createUsers', createUser);

router.post('/users/follow', followUser);

router.post('/users/deleteFollow', deleteAllFollowRelations);


router.post('/login', login);

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

module.exports = router;
