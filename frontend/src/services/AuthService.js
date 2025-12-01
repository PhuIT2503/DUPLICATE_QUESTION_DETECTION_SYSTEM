import UserModel from "../models/UserModel";
import StorageService from "./StorageService";
import { USER_ROLES, STORAGE_KEYS } from "../utils/constants";

export default class AuthService {
  static async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockUsers = {
          rd_staff: new UserModel(
            1,
            "rd_staff",
            "rd@uth.edu.vn",
            "Nguyễn Văn A",
            USER_ROLES.RD_STAFF
          ),
          dept_head: new UserModel(
            2,
            "dept_head",
            "truongkhoa@uth.edu.vn",
            "Trần Thị B",
            USER_ROLES.DEPARTMENT_HEAD
          ),
          subject_head: new UserModel(
            3,
            "subject_head",
            "truongbomon@uth.edu.vn",
            "Lê Văn C",
            USER_ROLES.SUBJECT_HEAD
          ),
          lecturer: new UserModel(
            4,
            "lecturer",
            "giangvien@uth.edu.vn",
            "Phạm Thị D",
            USER_ROLES.LECTURER
          ),
          exam_office: new UserModel(
            5,
            "exam_office",
            "khaothi@uth.edu.vn",
            "Hoàng Văn E",
            USER_ROLES.EXAM_OFFICE_HEAD
          ),
        };

        if (mockUsers[username] && password === "123456") {
          const user = mockUsers[username];
          const token = "mock_token_" + Date.now();

          StorageService.setItem(STORAGE_KEYS.TOKEN, token);
          StorageService.setItem(STORAGE_KEYS.USER, user);

          resolve({ user, token });
        } else {
          reject(new Error("Tên đăng nhập hoặc mật khẩu không đúng"));
        }
      }, 1000);
    });
  }

  static logout() {
    StorageService.removeItem(STORAGE_KEYS.TOKEN);
    StorageService.removeItem(STORAGE_KEYS.USER);
  }

  static getCurrentUser() {
    const userData = StorageService.getItem(STORAGE_KEYS.USER);
    if (userData) {
      return new UserModel(
        userData.id,
        userData.username,
        userData.email,
        userData.fullName,
        userData.role
      );
    }
    return null;
  }

  static getToken() {
    return StorageService.getItem(STORAGE_KEYS.TOKEN);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}
