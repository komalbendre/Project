import express from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get user's recent notifications
router.get("/recent", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      notifications: notifications.map(notif => ({
        _id: notif._id,
        type: notif.type,
        company: notif.company,
        position: notif.position,
        message: notif.message,
        createdAt: notif.createdAt,
        read: notif.read
      }))
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications"
    });
  }
});

// Mark notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating notification"
    });
  }
});

// Mark all notifications as read
router.put("/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating notifications"
    });
  }
});

export default router;