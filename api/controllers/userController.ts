import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import User from '../models/User'

export async function createUser(req: Request, res: Response) {  
const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    // Send a response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteUser(req: Request, res: Response) {
    const { userId } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }


  export async function updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { firstName, lastName, email, password } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the fields if provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      
      // If password is provided, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }



  export async function getUser(req: Request, res: Response) {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).select('-password'); // Exclude password
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }