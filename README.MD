# QBCA - Hệ thống Quản lý Ngân hàng Câu hỏi & Phát hiện Trùng lặp bằng AI

![Java Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![React](https://img.shields.io/badge/Frontend-React%20Vite-blue) ![Python AI](https://img.shields.io/badge/AI-Python%20Flask-yellow) ![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red) ![Status](https://img.shields.io/badge/Status-Portfolio_Showcase-grey)

> **Lưu ý:** Repository này là phiên bản lưu trữ mã nguồn (Source Code) phục vụ mục đích trình bày năng lực (Portfolio). Hệ thống yêu cầu cấu hình Database và AI Model phức tạp nên không bao gồm hướng dẫn chạy chi tiết tại đây.

## Giới thiệu dự án

**QBCA (Question Bank Management & Duplicate Detection System)** giải quyết bài toán cốt lõi trong việc quản lý ngân hàng đề thi tại các trường đại học: **Sự trùng lặp nội dung**.

Khi ngân hàng câu hỏi lên tới hàng ngàn câu, việc kiểm soát thủ công là bất khả thi. Hệ thống tích hợp một **Service AI riêng biệt** giúp tự động mã hóa ngữ nghĩa câu hỏi, so sánh và phát hiện các câu hỏi "tuy khác câu chữ nhưng giống ý nghĩa", giúp giảng viên lọc và nâng cao chất lượng đề thi.

### Tính năng chính (Key Features)

* **AI Duplicate Detection:** Sử dụng mô hình BERT để vector hóa văn bản và tính toán độ tương đồng (Cosine Similarity) để tìm câu hỏi trùng.
* **Đề thi thông minh:** Trộn đề, tạo mã đề tự động, xuất file PDF/Word.
* **Quản lý đa cấp:** Phân quyền chặt chẽ (Admin, Trưởng bộ môn, Giảng viên, Sinh viên).
* **Bảo mật:** Xác thực JWT, mã hóa mật khẩu, phân quyền API.

## Kiến trúc Hệ thống (System Architecture)

Hệ thống được thiết kế theo mô hình **Service-Oriented Architecture (SOA)**, tách biệt rõ ràng giữa các thành phần nghiệp vụ và xử lý tính toán nặng:

| Thành phần       | Công nghệ                    | Vai trò chính                                               |
| :--------------- | :--------------------------- | :---------------------------------------------------------- |
| **Frontend**     | ReactJS + Vite + TailwindCSS | Giao diện người dùng tương tác cao, Responsive.             |
| **Backend Core** | Java Spring Boot             | Xử lý logic nghiệp vụ, quản lý User, Exam, kết nối DB.      |
| **AI Service**   | Python Flask + Transformers  | Microservice chuyên biệt để xử lý NLP và so khớp trùng lặp. |
| **Database**     | Microsoft SQL Server         | Lưu trữ dữ liệu quan hệ (Users, Questions, Exams...).       |

### Luồng xử lý AI (AI Pipeline):

1. **Input:** Giảng viên thêm/import danh sách câu hỏi mới.
2. **Vectorization:** Spring Boot gửi nội dung sang **AI Service**. Service này dùng mô hình (BERT/Sentence-Transformers) để chuyển văn bản thành Vector.
3. **Similarity Check:** Tính toán khoảng cách giữa vector câu hỏi mới và toàn bộ ngân hàng câu hỏi hiện có.
4. **Result:** Trả về danh sách các câu hỏi có độ trùng lặp cao (>80%) để giảng viên quyết định giữ hay loại bỏ.

## Cấu trúc Repository

```text
DUPLICATE_QUESTION_DETECTION_SYSTEM/
├── frontend/           # ReactJS Source Code
│   ├── src/components  # Reusable UI Components
│   ├── src/pages       # Dashboard, Exam, Question Pages
│   └── src/services    # API Integration (Axios)
├── backend/            # Spring Boot Source Code
│   ├── src/main/java   # Controllers, Services, Repositories, Entities
│   └── src/resources   # Config & Properties
├── ai-service/         # Python Flask AI Module
│   ├── app.py          # API Endpoints cho AI
│   ├── question_encoder.py # Logic mã hóa câu hỏi
│   └── duplicate_checker.py # Thuật toán tìm kiếm trùng lặp
└── sql1/               # Database Scripts
```

## Đội ngũ thực hiện & Ghi nhận (Team & Credits)

Dự án này được phát triển bởi nhóm sinh viên trường Đại học Giao thông Vận tải TP.HCM (UTH) nhằm mục đích nghiên cứu khoa học/đồ án môn học.

**Thành viên nhóm:**
| Họ tên                 | Vai trò      | Đóng góp chính                                                                                                     |
| :--------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------- |
| Phan Quyết Tâm Phú     | AI Developer | Thiết kế và triển khai AI Service, xây dựng API cho AI, quản lý log dữ liệu và tích hợp AI với Backend Spring Boot |
| Nguyễn Gia Huy         | Backend      | QuestionController                                                                                                 |
| Hoàng Nguyễn Viết Quốc | Backend      | Auth, User, SubjectController                                                                                      |
| Nguyễn Thanh Phúc Tuỷ  | Frontend     | Auth, Dashboard                                                                                                    |
| Nguyễn Thái Tuấn       | Frontend     | Quản lý câu hỏi                                                                                                    |
| Huỳnh Bá Thành         | Frontend     | Đề thi, Thống kê                                                                                                   |
| Lục Sỹ Minh Hiền       | Backend      | Exam, ReportController                                                                                             |

Repository này là bản lưu trữ (fork/clone) cá nhân của tôi để phục vụ mục đích lưu trữ Portfolio và trình bày kỹ thuật.

## Liên hệ
- Email: tamphu.workhard@gmail.com
- GitHub: https://github.com/PhuIT2503

