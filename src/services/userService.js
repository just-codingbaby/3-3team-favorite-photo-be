import userRepository from '../repositories/userRepository.js';

async function getAllUsers() {
  return await userRepository.getAll();
}

async function createUser() {
  return await userRepository.create();
}

export default {
  createUser,
  getAllUsers,
};
