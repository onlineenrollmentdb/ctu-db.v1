const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get notifications for a user
router.get("/:user_type/:user_id", notificationController.getNotifications);
router.post("/", notificationController.createNotification);
router.put("/:notification_id/seen", notificationController.markAsSeen);
router.put("/:notification_id/read", notificationController.markAsRead);
router.delete("/:notification_id", notificationController.deleteNotification);
router.put("/batch/seen", notificationController.markMultipleAsSeen);

module.exports = router;
