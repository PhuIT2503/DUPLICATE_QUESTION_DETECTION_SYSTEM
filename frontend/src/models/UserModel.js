export default class UserModel {
  constructor(id, username, email, fullName, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.role = role;
  }

  getRoleName() {
    const { ROLE_NAMES } = require("../utils/constants");
    return ROLE_NAMES[this.role] || "Không xác định";
  }

  hasPermission(requiredRole) {
    return this.role === requiredRole;
  }

  canAccess(allowedRoles) {
    return allowedRoles.includes(this.role);
  }
}
