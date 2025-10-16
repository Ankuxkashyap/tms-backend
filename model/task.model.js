import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"], 
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], 
      default: "PENDING",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
