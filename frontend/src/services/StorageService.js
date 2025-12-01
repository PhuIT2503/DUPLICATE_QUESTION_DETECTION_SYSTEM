export default class StorageService {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  }

  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}
