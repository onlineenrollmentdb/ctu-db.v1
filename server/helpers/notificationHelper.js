// helpers/notificationHelper.js
const db = require('../db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
    },
});

// 🔹 Universal notification sender
exports.sendNotification = async ({
    user_type,
    user_id,
    title,
    message,
    type = "general",
    link = null,
    sender_id = null,
    sender_type = "admin",
    email = null
}) => {
    if (!user_type || !user_id) return;

    await db.execute(
        `INSERT INTO notifications
            (user_type, user_id, title, message, type, link, sender_id, sender_type, is_read, is_seen, is_deleted, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, NOW())`,
        [user_type, user_id, title, message, type, link, sender_id, sender_type]
    );

    // Optional: send email
    if (email) {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: title,
            text: message,
        });
    }
};

// 🔹 Delete notification by ID
exports.deleteNotification = async (notification_id) => {
    try {
        await db.execute(
            "DELETE FROM notifications WHERE notification_id = ?",
            [notification_id]
        );
        return { success: true };
    } catch (err) {
        console.error("deleteNotification error:", err);
        return { success: false, error: "Failed to delete notification" };
    }
};
