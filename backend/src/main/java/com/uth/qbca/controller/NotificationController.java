package com.uth.qbca.controller;

import com.uth.qbca.model.Notification;
import com.uth.qbca.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Lấy tất cả thông báo của một người dùng, mới nhất trước
     */
    @GetMapping("/user/{userId}")
    public List<Notification> getByUser(@PathVariable Long userId) {
        return notificationService.getByUserId(userId);
    }
    
    /**
     * Lấy tất cả thông báo với query parameter (để hỗ trợ frontend)
     */
    @GetMapping
    public List<Notification> getByUserParam(@RequestParam String userId) {
        try {
            // Thử convert sang Long nếu là số
            Long userIdLong = Long.parseLong(userId);
            return notificationService.getByUserId(userIdLong);
        } catch (NumberFormatException e) {
            // Nếu không phải số, tìm user bằng userCode
            return notificationService.getByUserCode(userId);
        }
    }

    /**
     * Đánh dấu thông báo là đã đọc
     */
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    /**
     * Xoá một thông báo
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        notificationService.delete(id);
    }

    /**
     * (Tùy chọn) Tạo thông báo test thủ công
     */
    @PostMapping
    public Notification createNotification(@RequestBody Notification request) {
        return notificationService.createNotification(
            request.getTitle(),
            request.getMessage(),
            request.getUserId()
        );
    }
}