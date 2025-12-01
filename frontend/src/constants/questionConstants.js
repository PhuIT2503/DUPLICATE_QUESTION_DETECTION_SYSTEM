// Question type constants
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  ESSAY: "essay",
  FILL_IN_BLANK: "fill_in_blank",
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: "Trắc nghiệm",
  [QUESTION_TYPES.ESSAY]: "Tự luận",
  [QUESTION_TYPES.FILL_IN_BLANK]: "Điền từ",
};

// Difficulty constants
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

export const DIFFICULTY_LABELS = {
  [DIFFICULTY_LEVELS.EASY]: "Dễ",
  [DIFFICULTY_LEVELS.MEDIUM]: "Trung bình",
  [DIFFICULTY_LEVELS.HARD]: "Khó",
};

// Duplicate detection constants
export const DUPLICATE_STATUS = {
  UNIQUE: "unique",
  DUPLICATE: "duplicate",
};

export const DUPLICATE_STATUS_LABELS = {
  [DUPLICATE_STATUS.UNIQUE]: "Không trùng lặp",
  [DUPLICATE_STATUS.DUPLICATE]: "Trùng lặp",
};

// Agency user roles
export const AGENCY_ROLES = [
  "SUBJECT_HEAD",
  "DEPARTMENT_HEAD",
  "EXAM_OFFICE_HEAD",
];
