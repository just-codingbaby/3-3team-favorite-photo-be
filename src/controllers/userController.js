import express from 'express';
import userService from '../services/userService.js';

const userController = express.Router();

userController.get('/', async (req, res) => {
  const users = await userService.getAllUsers();
  return res.json(users);
});

userController.post('/', async (req, res) => {
  const user = await userService.createUser();
  return res.json(user);
});

export default userController;
