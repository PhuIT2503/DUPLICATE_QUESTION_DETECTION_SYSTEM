package com.uth.qbca.scheduler;

import com.uth.qbca.service.AssignmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TaskNotificationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TaskNotificationScheduler.class);

    @Autowired
    private AssignmentService assignmentService;

    /**
     * Kiểm tra nhiệm vụ sắp đến hạn mỗi ngày lúc 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkUpcomingTasks() {
        try {
            logger.info("Running scheduled check for upcoming tasks");
            assignmentService.checkAndNotifyUpcomingTasks();
            logger.info("Completed scheduled check for upcoming tasks");
        } catch (Exception e) {
            logger.error("Error in scheduled check for upcoming tasks: ", e);
        }
    }

    /**
     * Kiểm tra nhiệm vụ quá hạn mỗi ngày lúc 8:00 AM
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkOverdueTasks() {
        try {
            logger.info("Running scheduled check for overdue tasks");
            assignmentService.checkAndNotifyOverdueTasks();
            logger.info("Completed scheduled check for overdue tasks");
        } catch (Exception e) {
            logger.error("Error in scheduled check for overdue tasks: ", e);
        }
    }

    /**
     * Kiểm tra nhiệm vụ sắp đến hạn mỗi 4 giờ (cho test)
     */
    @Scheduled(fixedRate = 14400000) // 4 giờ = 4 * 60 * 60 * 1000 ms
    public void checkUpcomingTasksFrequent() {
        try {
            logger.debug("Running frequent check for upcoming tasks (every 4 hours)");
            assignmentService.checkAndNotifyUpcomingTasks();
        } catch (Exception e) {
            logger.error("Error in frequent check for upcoming tasks: ", e);
        }
    }
}
