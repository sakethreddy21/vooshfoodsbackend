import { Request, Response } from 'express';
import Task from '../models/Task';
import User from '../models/User';

// Create a new task
export async function createTask(req: Request, res: Response) {
  const { title, description, userID, columnID } = req.body;

  // Basic validation
  if (!title || !description || !userID || !columnID) {
    return res.status(400).json({ error: 'All fields (title, description, userID, columnID) are required' });
  }

  if (![1, 2, 3].includes(columnID)) {
    return res.status(400).json({ error: 'Invalid columnID. It should be 1 (Todo), 2 (In-progress), or 3 (Completed).' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({ error: 'Invalid userID. User does not exist.' });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      userID,
      columnID
    });

    // Save the task to the database
    await newTask.save();

    // Send a success response
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}


// Get all tasks by userID
export async function getTasksByUserID(req: Request, res: Response) {
    const { userID } = req.params;
  
    try {
      const tasks = await Task.find({ userID });
      
      if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this user' });
      }
  
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get a single task by todoID
export async function getTaskByID(req: Request, res: Response) {
    const { todoID } = req.params;
  
    try {
      const task = await Task.findById(todoID);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ task });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  
  // Delete a task by todoID
export async function deleteTaskByID(req: Request, res: Response) {
    const { todoID } = req.params;
  
    try {
      const deletedTask = await Task.findByIdAndDelete(todoID);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  
  // Update a task by todoID
export async function updateTaskByID(req: Request, res: Response) {
    const { todoID } = req.params;
    const { title, description, columnID } = req.body;
  
    // Basic validation
    if (!title || !description || !columnID) {
      return res.status(400).json({ error: 'All fields (title, description, columnID) are required' });
    }
  
    if (![1, 2, 3].includes(columnID)) {
      return res.status(400).json({ error: 'Invalid columnID. It should be 1 (Todo), 2 (In-progress), or 3 (Completed).' });
    }
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        todoID,
        { title, description, columnID },
        { new: true }  // Return the updated document
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  