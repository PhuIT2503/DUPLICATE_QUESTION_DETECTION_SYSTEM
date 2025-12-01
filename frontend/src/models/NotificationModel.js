export default class NotificationModel {
  constructor({ id, title, message, isRead, userId, createdAt }) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.isRead = isRead;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}


