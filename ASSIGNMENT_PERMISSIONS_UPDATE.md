# CẬP NHẬT QUYỀN PHÂN CÔNG NHIỆM VỤ

## Tóm tắt thay đổi
Đã cập nhật hệ thống phân quyền để cho phép **Trưởng khoa (DEPARTMENT_HEAD)** và **Trưởng bộ môn (SUBJECT_HEAD)** có quyền xem và phân công nhiệm vụ.

## Các thay đổi đã thực hiện

### 1. Backend - AssignmentController.java

#### ✅ Cập nhật quyền tạo assignment mới:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

#### ✅ Cập nhật quyền xem danh sách assignments:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

#### ✅ Cập nhật quyền xem assignment theo ID:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

#### ✅ Cập nhật quyền xem assignments theo user ID:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

#### ✅ Cập nhật quyền cập nhật assignment:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

#### ✅ Cập nhật quyền xóa assignment:
```java
// TRƯỚC:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")

// SAU:
@PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
```

### 2. Frontend - AssignmentsPage.jsx

#### ✅ Cập nhật kiểm tra quyền trong component:
```javascript
// TRƯỚC:
const canViewAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD'].includes(user.role);
const canCreateAssignments = user && ['RD_STAFF', 'RD_ADMIN'].includes(user.role);

// SAU:
const canViewAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD', 'SUBJECT_HEAD'].includes(user.role);
const canCreateAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD', 'SUBJECT_HEAD'].includes(user.role);
```

### 3. Routes Configuration (đã đúng từ trước)
File `routes.js` đã được cấu hình đúng để cho phép SUBJECT_HEAD truy cập trang assignments:
```javascript
{
  path: "/assignments",
  name: "Phân công nhiệm vụ",
  icon: Calendar,
  allowedRoles: [
    USER_ROLES.SUBJECT_HEAD,        // ✅ Đã có
    USER_ROLES.DEPARTMENT_HEAD,     // ✅ Đã có
    USER_ROLES.EXAM_OFFICE_HEAD,
    USER_ROLES.RD_STAFF,
    USER_ROLES.RD_ADMIN,
  ],
}
```

## Kết quả sau cập nhật

### Quyền của DEPARTMENT_HEAD (Trưởng khoa):
- ✅ Xem danh sách assignments
- ✅ Tạo assignment mới  
- ✅ Cập nhật assignment
- ✅ Xóa assignment
- ✅ Duyệt/từ chối assignments
- ✅ Xem submissions và duyệt/từ chối

### Quyền của SUBJECT_HEAD (Trưởng bộ môn):
- ✅ Xem danh sách assignments
- ✅ Tạo assignment mới
- ✅ Cập nhật assignment 
- ✅ Xóa assignment
- ✅ Nộp file submissions
- ✅ Xem và duyệt/từ chối submissions của người khác
- ❌ Không thể duyệt/từ chối assignments (chỉ có thể làm với submissions)

### So sánh quyền:

| Chức năng | DEPARTMENT_HEAD | SUBJECT_HEAD | RD_STAFF/ADMIN |
|-----------|:---------------:|:------------:|:--------------:|
| Xem assignments | ✅ | ✅ | ✅ |
| Tạo assignment | ✅ | ✅ | ✅ |
| Cập nhật assignment | ✅ | ✅ | ✅ |
| Xóa assignment | ✅ | ✅ | ✅ |
| Duyệt/từ chối assignments | ✅ | ❌ | ✅ |
| Nộp submissions | ❌ | ✅ | ❌ |
| Duyệt submissions | ✅ | ✅ | ✅ |

## Lưu ý
- Tất cả các thay đổi đã được áp dụng và sẵn sàng để test
- Cần khởi động lại backend để áp dụng các thay đổi @PreAuthorize
- Frontend sẽ tự động cập nhật giao diện dựa trên role của user hiện tại
