import {
  Home,
  FileText,
  Users,
  BookOpen,
  Calendar,
  FileCheck,
} from "lucide-react";
import { USER_ROLES } from "../utils/constants";

export const allRoutes = [
  {
    path: "/dashboard",
    name: "Trang chủ",
    icon: Home,
    allowedRoles: Object.values(USER_ROLES),
  },
  {
    path: "/subjects",
    name: "Quản lý môn học",
    icon: BookOpen,
    allowedRoles: [USER_ROLES.RD_STAFF, USER_ROLES.RD_ADMIN],
  },
  {
    path: "/questions",
    name: "Ngân hàng câu hỏi",
    icon: FileText,
    allowedRoles: [
      USER_ROLES.LECTURER,
      USER_ROLES.SUBJECT_HEAD,
      USER_ROLES.RD_STAFF,
      USER_ROLES.RD_ADMIN,
    ],
  },
  {
    path: "/assignments",
    name: "Phân công nhiệm vụ",
    icon: Calendar,
    allowedRoles: [
      USER_ROLES.SUBJECT_HEAD,
      USER_ROLES.DEPARTMENT_HEAD,
      USER_ROLES.EXAM_OFFICE_HEAD,
      USER_ROLES.RD_STAFF,
      USER_ROLES.RD_ADMIN,
    ],
  },
  {
    path: "/my-tasks",
    name: "Nhiệm vụ của tôi",
    icon: Calendar,
    allowedRoles: [USER_ROLES.LECTURER],
  },
  {
    path: "/exams",
    name: "Quản lý đề thi",
    icon: FileCheck,
    allowedRoles: [
      USER_ROLES.LECTURER,
      USER_ROLES.SUBJECT_HEAD,
      USER_ROLES.EXAM_OFFICE_HEAD,
      USER_ROLES.RD_STAFF,
      USER_ROLES.RD_ADMIN,
      USER_ROLES.DEPARTMENT_HEAD,
    ],
  },
  {
    path: "/users",
    name: "Quản lý người dùng",
    icon: Users,
    allowedRoles: [USER_ROLES.RD_STAFF, USER_ROLES.RD_ADMIN],
  },
];
