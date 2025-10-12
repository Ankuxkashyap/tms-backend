import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["USER", "ADMIN", "MANAGER"],
    default: "USER",
  },

  tasksCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  tasksAssigned: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
