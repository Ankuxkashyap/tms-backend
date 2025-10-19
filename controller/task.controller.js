import mongoose from "mongoose";
import Task from "../model/task.model.js";
import {io} from "../index.js"
import Notification from "../model/notification.model.js";

export const CreateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (!title || !description || !status || !assignedTo || !dueDate) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      status,
      priority,
      createdBy: req.user._id,
      dueDate,
    });

    const newNotification = await Notification.create({
      user: assignedTo,
      message: `You have been assigned a new task: ${title}`,
      taskId: newTask._id,
    });

    io.to(assignedTo.toString()).emit("notification", newNotification);

    console.log("Notification sent:", newNotification);

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
      notification: newNotification,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      // .populate("notifications");
    res.status(200).json({ tasks, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getTasksAssignedToUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    res.status(200).json({ tasks, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getTasksCreatedByUser = async (req, res) => {
  try {
    // console.log("api called");
    const userId = req.user._id;
    const tasks = await Task.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");
    res.status(200).json({ tasks, success: true });
    // console.log(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateTaskStatus = async (req, res) => {
  try{
    const { id } = req.params;

    const { status } = req.body; 

    console.log(req.params);
    console.log(id)

    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value", success: false });
    }
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }
    task.status = status;
    await task.save();
    res.status(200).json({ message: "Task status updated successfully", success: true });
  }
  catch(error){
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}

export const getOverdueTasks = async (req, res) => {
  try{
    const currentDate = new Date();
    const userId = req.user._id;
    // console.log(userId);
    const tasks = await Task.find({ dueDate: { $lt: currentDate }, status: { $ne: "COMPLETED" },assignedTo:userId }).sort({ dueDate: -1 })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if(tasks.length > 0){
      res.status(200).json({ tasks, success: true });
    }else{
      res.status(404).json({ message: "No overdue tasks found", success: false });
    }

  }catch(error){
    console.error("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}


export const getTasksById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "Invalid task ID", 
        success: false 
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        message: "Task not found", 
        success: false 
      });
    }

    res.status(200).json({ task, success: true });
  } catch (err) {
    console.error("Error fetching task by ID:", err);
    res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};


export const getTasksByQuery = async (req, res) => {
  try {
    const {query} = req.body 

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const tasks = await Task.find({
      assignedTo: req.user._id, 
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        {status:{$regex:query,$options:"i"}},
        {priority:{$regex:query,$options:"i"}}
      ],
    }).sort({ createdAt: -1 });

    if (tasks.length > 0) {
      return res.status(200).json({ tasks, success: true });
    } else {
      return res.status(404).json({ message: "No tasks found", success: false });
    }
  } catch (error) {
    console.error("Error in getTasksByQuery:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const DeleteTask = async(req,res) =>{
  const {id} = req.params
  const user = req.user;
  // console.log(user)
  try{
    const task = await Task.findByIdAndDelete(id);

    if(!task){
      return res.status(404).json({ message: "Task not found", success: false });
    }

    if(task.createdBy.toString() !== user._id.toString()){
      return res.status(403).json({ message: "You are not authorized to delete this task", success: false });
    }

    res.status(200).json({ message: "Task deleted successfully", success: true });

  }catch(error){
    res.status(500).json({ message: "Internal server error", success: false });
    console.log(error);
  }
}

export const EditTask = async(req,res) =>{
  try{
    const {id} = req.params;
    const user = req.user;
    const {title,description,assignedTo,dueDate,priority,status} = req.body;
    const task = await Task.findById(id);

    if(!task){
      return res.status(404).json({ message: "Task not found", success: false });
    }

    if(task.createdBy.toString() !== user._id.toString()){
      return res.status(403).json({ message: "You are not authorized to update this task", success: false });
    }

    task.title = title;
    task.description = description;
    task.assignedTo = assignedTo;
    task.dueDate = dueDate;
    task.priority = priority;
    task.status = status;

    await task.save();

    res.status(200).json({ message: "Task updated successfully", success: true });

  }catch(error){
    res.status(500).json({ message: "Internal server error", success: false });
    console.log(error);
  }
}
