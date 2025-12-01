export const USER_ROLES = {
  RD_STAFF: "RD_STAFF",
  RD_ADMIN: "RD_ADMIN", 
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
  SUBJECT_HEAD: "SUBJECT_HEAD",
  LECTURER: "LECTURER",
  EXAM_OFFICE_HEAD: "EXAM_OFFICE_HEAD",
};

export const ROLE_NAMES = {
  [USER_ROLES.RD_STAFF]: "Nhân viên R&D",
  [USER_ROLES.RD_ADMIN]: "Quản trị viên R&D",
  [USER_ROLES.DEPARTMENT_HEAD]: "Trưởng khoa",
  [USER_ROLES.SUBJECT_HEAD]: "Trưởng bộ môn",
  [USER_ROLES.LECTURER]: "Giảng viên",
  [USER_ROLES.EXAM_OFFICE_HEAD]: "Trưởng phòng Khảo thí",
};

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  USERS: "/api/users",
  SUBJECTS: "/api/subjects",
  QUESTIONS: "/api/questions",
  ASSIGNMENTS: "/api/assignments",
};

export const STORAGE_KEYS = {
  TOKEN: "qbca_token",
  USER: "qbca_user",
};
