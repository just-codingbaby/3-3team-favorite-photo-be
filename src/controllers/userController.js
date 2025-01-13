import express from 'express';
import userService from '../services/userService.js';

const userController = express.Router();

userController.get('/', async (req, res) => {
  //  #swagger.tags = ['Users']
  const users = await userService.getAllUsers();
  return res.json(users);
});

userController.post('/', async (req, res) => {
  //  #swagger.tags = ['Users']
  const user = await userService.createUser();
  return res.json(user);
});

userController.get('/profile/:email', async (req, res) => {
    //  #swagger.tags = ['Users']
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ message: '이메일이 제공되지 않았습니다' });
    }

    const user = await userService.getProfile(email);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

export default userController;