import { Notification } from "../models/notification.model.js";

export const sendNotification = async ({ userId, message, type, link }) => {
  return await Notification.create({ user: userId, message, type, link });
};