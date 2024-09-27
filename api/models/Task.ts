import { Schema, model, Document } from 'mongoose';

// Define an interface representing a task document in MongoDB
interface ITask extends Document {
  title: string;
  description: string;
  userID: Schema.Types.ObjectId;  // Reference to a user
  columnID: number;  // 1: Todo, 2: In-progress, 3: Completed
}

// Create the Task schema
const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  columnID: {
    type: Number,
    enum: [1, 2, 3],  // 1: Todo, 2: In-progress, 3: Completed
    required: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt timestamps
});

// Create and export the Task model
const Task = model<ITask>('Task', taskSchema);

export default Task;
