const { sendSuccess } = require('../utils/response');

const getMyNotifications = async (req, res, next) => {
  try {
    return sendSuccess(res, [], 'My notifications');
  } catch (error) {
    next(error);
  }
};

const sendNotification = async (req, res, next) => {
  try {
    return sendSuccess(res, req.body, 'Notification sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, sendNotification };
