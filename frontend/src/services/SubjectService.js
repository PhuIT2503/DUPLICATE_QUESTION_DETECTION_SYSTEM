import axios from "axios";

const API_URL = "http://localhost:8080/api/subjects";

const getAllSubjects = () => axios.get(API_URL);

const createSubject = (data) => axios.post(API_URL, data);

const deleteSubject = (id) => axios.delete(`${API_URL}/${id}`);

const subjectService = {
  getAllSubjects,
  createSubject,
  deleteSubject,
};

export default subjectService;
