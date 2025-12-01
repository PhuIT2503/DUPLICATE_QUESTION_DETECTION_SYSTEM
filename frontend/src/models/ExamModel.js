export const DifficultyLevel = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};

export class Exam {
  constructor(id, title, questions, createdBy, createdAt, subjectId) {
    this.id = id;
    this.title = title;
    this.questions = questions;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.subjectId = subjectId;
  }
}

export class Question {
  constructor(id, content, difficulty, cloId) {
    this.id = id;
    this.content = content;
    this.difficulty = difficulty;
    this.cloId = cloId;
  }
}
