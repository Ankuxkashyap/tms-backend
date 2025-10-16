import Notification from "../model/notification.model.js";

export const getNotificationsByUser = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
        }
        
        const notifications = await Notification.find({ user: req.user._id }).populate("user","name").limit(5).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const showMoreNotifications = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        const notifications = await Notification.find({ user: req.user._id }).populate("user","name").sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateReadNotification = async (req, res) => {
    try{

        if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
        }

        const notifaction = await Notification.find({user:req.user._id}).updateMany({read:false},{read:true});
        res.status(200).json(notifaction);
    }catch(err){
        res.status(500).json({ message: "Internal server error" });
        console.log(err);
    }
};