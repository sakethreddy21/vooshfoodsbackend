import express from 'express';
import { deleteUser, updateUser, getUser, createUser } from '../controllers/userController';

const router = express.Router();

// Create a new user
router.post('/register', createUser);

// Delete a user
router.delete('/:userId', deleteUser);

// Update a user
router.put('/:userId', updateUser);

// Get a user
router.get('/:userId', getUser);



export default router;
