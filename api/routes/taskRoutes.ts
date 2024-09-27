import express from 'express';
import { 
  getTasksByUserID, 
  getTaskByID, 
  deleteTaskByID, 
  updateTaskByID ,
  createTask
} from '../controllers/taskController';

const router = express.Router();

// Route to get all tasks by userID
router.get('/user/:userID', getTasksByUserID);

router.post('/', createTask)

// Route to get a single task by todoID
router.get('/:todoID', getTaskByID);

// Route to delete a task by todoID
router.delete('/:todoID', deleteTaskByID);

// Route to update a task by todoID
router.put('/:todoID', updateTaskByID);

export default router;
