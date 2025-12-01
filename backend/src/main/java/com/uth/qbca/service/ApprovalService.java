package com.uth.qbca.service;

import com.uth.qbca.dto.ApprovalRequestDTO;
import com.uth.qbca.model.ExamApproval;
import com.uth.qbca.model.ExamSubmission;
import com.uth.qbca.repository.ExamApprovalRepository;
import com.uth.qbca.repository.ExamSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ApprovalService {

    @Autowired
    private ExamApprovalRepository approvalRepo;

    @Autowired
    private ExamSubmissionRepository submissionRepo;

    @Autowired
    private NotificationService notificationService;

    public ExamApproval approve(ApprovalRequestDTO dto) {
        Optional<ExamSubmission> submissionOpt = submissionRepo.findById(dto.getSubmissionId());
        if (submissionOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy đề thi với ID: " + dto.getSubmissionId());
        }

        ExamSubmission submission = submissionOpt.get();

        // Cập nhật trạng thái đề
        submission.setStatus(dto.getStatus());
        submissionRepo.save(submission);

        // Gửi thông báo
        String notifMsg = "Đề thi '" + submission.getTitle() + "' đã được " +
                (dto.getStatus().equalsIgnoreCase("APPROVED") ? "phê duyệt ✅" : "từ chối ❌");

        notificationService.sendNotification(
                "Kết quả phê duyệt đề thi",
                notifMsg,
                submission.getCreatedBy()
        );

        // Tạo bản ghi phê duyệt
        ExamApproval approval = new ExamApproval();
        approval.setSubmission(submission); // Gán entity
        approval.setApprovedBy(dto.getApprovedBy());
        approval.setStatus(dto.getStatus());
        approval.setComment(dto.getComment());
        // approvedAt được set mặc định trong constructor hoặc entity

        return approvalRepo.save(approval);
    }
}
