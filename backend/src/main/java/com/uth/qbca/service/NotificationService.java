package com.uth.qbca.service;

import com.uth.qbca.model.Notification;
import com.uth.qbca.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Tạo một thông báo mới
     */
    public Notification createNotification(String title, String message, Long userId) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setUserId(userId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    /**
     * Lấy danh sách thông báo theo userId, sắp xếp mới nhất trước
     */
    public List<Notification> getByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Lấy danh sách thông báo theo userCode, sắp xếp mới nhất trước
     */
    public List<Notification> getByUserCode(String userCode) {
        return notificationRepository.findByUserCodeOrderByCreatedAtDesc(userCode);
    }

    /**
     * Đánh dấu thông báo là đã đọc
     */
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Xoá một thông báo
     */
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with ID: " + id);
        }
        notificationRepository.deleteById(id);
    }

    public void sendNotification(String title, String message, Long userId) {
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi được giao nhiệm vụ mới
     */
    public void notifyTaskAssigned(Long userId, String taskName, String deadline) {
        String title = "Nhiệm vụ mới được giao";
        String message = String.format("Bạn đã được giao nhiệm vụ '%s'. Hạn hoàn thành: %s", 
                                      taskName, deadline);
        
        System.out.println("=== NOTIFICATION DEBUG ===");
        System.out.println("Creating notification for userId: " + userId);
        System.out.println("Title: " + title);
        System.out.println("Message: " + message);
        
        Notification notification = createNotification(title, message, userId);
        System.out.println("Notification created with ID: " + notification.getId());
        System.out.println("========================");
    }

    /**
     * Tạo thông báo khi hoàn thành nhiệm vụ
     */
    public void notifyTaskCompleted(Long userId, String taskName) {
        String title = "Nhiệm vụ đã hoàn thành";
        String message = String.format("Bạn đã hoàn thành nhiệm vụ '%s'", taskName);
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi nhiệm vụ sắp đến hạn (1 ngày)
     */
    public void notifyTaskDueSoon(Long userId, String taskName, String deadline) {
        String title = "Nhiệm vụ sắp đến hạn";
        String message = String.format("Nhiệm vụ '%s' sẽ đến hạn vào %s. Vui lòng hoàn thành sớm!", 
                                      taskName, deadline);
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi nhiệm vụ quá hạn
     */
    public void notifyTaskOverdue(Long userId, String taskName, String deadline) {
        String title = "Nhiệm vụ quá hạn";
        String message = String.format("Nhiệm vụ '%s' đã quá hạn từ %s. Vui lòng hoàn thành ngay!", 
                                      taskName, deadline);
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi nhiệm vụ được duyệt
     */
    public void notifyTaskApproved(Long userId, String taskName) {
        String title = "Nhiệm vụ đã được duyệt";
        String message = String.format("Nhiệm vụ '%s' của bạn đã được duyệt. Chúc mừng!", taskName);
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi nhiệm vụ bị từ chối
     */
    public void notifyTaskRejected(Long userId, String taskName, String reason) {
        String title = "Nhiệm vụ cần chỉnh sửa";
        String message = String.format("Nhiệm vụ '%s' cần được chỉnh sửa. Lý do: %s", 
                                      taskName, reason != null ? reason : "Không có lý do cụ thể");
        createNotification(title, message, userId);
    }

    /**
     * Tạo thông báo khi có file được nộp (cho người giao nhiệm vụ)
     */
    public void notifyFileSubmitted(Long assignerId, String taskName, String submitterName, int fileCount) {
        String title = "Có file mới được nộp";
        String message = String.format("%s đã nộp %d file cho nhiệm vụ '%s'. Vui lòng kiểm tra và phản hồi.", 
                                      submitterName, fileCount, taskName);
        createNotification(title, message, assignerId);
    }

    /**
     * Tạo thông báo khi có phản hồi từ người giao nhiệm vụ (cho người nhận nhiệm vụ)
     */
    public void notifyFeedbackReceived(Long assigneeId, String taskName, String feedback) {
        String title = "Có phản hồi mới";
        String message = String.format("Bạn có phản hồi mới cho nhiệm vụ '%s': %s", 
                                      taskName, feedback);
        createNotification(title, message, assigneeId);
    }

    /**
     * Tạo thông báo khi file được duyệt (cho người nộp)
     */
    public void notifyFileApproved(Long assigneeId, String taskName, String fileName) {
        String title = "File đã được duyệt";
        String message = String.format("File '%s' trong nhiệm vụ '%s' đã được duyệt. Chúc mừng!", 
                                      fileName, taskName);
        createNotification(title, message, assigneeId);
    }

    /**
     * Tạo thông báo khi file bị từ chối (cho người nộp)
     */
    public void notifyFileRejected(Long assigneeId, String taskName, String fileName, String reason) {
        String title = "File cần chỉnh sửa";
        String message = String.format("File '%s' trong nhiệm vụ '%s' cần chỉnh sửa. Lý do: %s", 
                                      fileName, taskName, reason != null ? reason : "Không có lý do cụ thể");
        createNotification(title, message, assigneeId);
    }

    /**
     * Tạo thông báo nhắc nhở nộp bài (cho người nhận nhiệm vụ)
     */
    public void notifySubmissionReminder(Long assigneeId, String taskName, String deadline) {
        String title = "Nhắc nhở nộp bài";
        String message = String.format("Bạn chưa nộp file cho nhiệm vụ '%s'. Hạn chót: %s. Vui lòng nộp sớm!", 
                                      taskName, deadline);
        createNotification(title, message, assigneeId);
    }
}
