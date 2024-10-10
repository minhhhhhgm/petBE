const Notification = require('../models/notificationModel');


const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Tìm thông báo dành cho người dùng
        const notifications = await Notification.find({ recipient: userId }).populate('sender', 'name');

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getNotifications
};