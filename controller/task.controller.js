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
      dueDate
    });

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
