const Notification = require('../models/Notification');

/**
 * Creates a notification record and optionally emits socket event if socket.io is available
 */
const createNotification = async ({ userId, type, title, message, entityId, entityType, io = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      entityId,
      entityType
    });

    if (io) {
      io.to(`user_${userId.toString()}`).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    return null;
  }
};

module.exports = {
  createNotification
};
