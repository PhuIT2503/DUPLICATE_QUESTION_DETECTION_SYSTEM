import { useState } from "react";

export const useQuestionFormModal = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const openAddForm = () => {
    console.log("Adding new question");
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const openEditForm = (question) => {
    console.log("Editing question:", question);
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const closeForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  return {
    showQuestionForm,
    editingQuestion,
    openAddForm,
    openEditForm,
    closeForm,
  };
};
