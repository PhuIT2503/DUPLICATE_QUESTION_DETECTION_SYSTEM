package com.uth.qbca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;

    private String title;
    private String message;
    private boolean isRead;
    private Long userId;
    private LocalDateTime createdAt;
}
