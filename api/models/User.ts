import { Schema, model, Document } from 'mongoose';

// Define an interface representing a user document in MongoDB
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Create the User schema
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// Create and export the User model
const User = model<IUser>('User', userSchema);

export default User;
