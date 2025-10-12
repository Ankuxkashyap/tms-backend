import Task from "../model/task.model.js";

export const CreateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required", success: false });
    }
    if (!assignedTo) {
      return res.status(400).json({ message: "AssignedTo is required", success: false });
    }
    if (!dueDate) {
      return res.status(400).json({ message: "DueDate is required", success: false });
    }


    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      dueDate,
      // notifications: [
      //   {
      //     message: `Task "${title}" has been created and assigned to you.`,
      //     user: assignedTo,
      //   }
      // ],
    });

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask, success: true });
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

