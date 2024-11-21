import express from 'express';
import Notification from '../schemas/notificationModel.js';

const router = express.Router();

// Create a notification
router.post('/create', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const newNotification = new Notification({ userId, message });

    await newNotification.save();
    res.status(201).json({ message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
