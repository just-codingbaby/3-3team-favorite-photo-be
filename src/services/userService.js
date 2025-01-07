import userRepository from '../repositories/userRepository.js';

async function getAllUsers() {
  return userRepository.getAll();
}

async function createUser() {
  return await userRepository.create();
}

export default {
  createUser,
  getAllUsers,
};
