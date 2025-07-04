import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, notifications));
});

const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, "Notification not found");

  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  notification.seen = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, notification, "Marked as read"));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, seen: false },
    { seen: true }
  );
  res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
});

const getUnseenNotificationCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    seen: false
  });

  res.status(200).json(new ApiResponse(200, { count }));
});

export { getUserNotifications, markAsRead, getUnseenNotificationCount, markAllAsRead };
