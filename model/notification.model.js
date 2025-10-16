import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
    message: {
      type: String,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
