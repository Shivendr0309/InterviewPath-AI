import api from "../api/axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProblems = async (params = {}) => {
  const res = await api.get("/problems", { ...authHeader(), params });
  return res.data.data;
};

export const getProblemById = async (id) => {
  const res = await api.get(`/problems/${id}`, authHeader());
  return res.data.data;
};

export const getProblemStats = async () => {
  const res = await api.get("/problems/meta/stats", authHeader());
  return res.data.data;
};

export const runCode = async (problemId, payload) => {
  const res = await api.post(`/submissions/run/${problemId}`, payload, authHeader());
  return res.data;
};

export const submitCode = async (problemId, payload) => {
  const res = await api.post(`/submissions/${problemId}`, payload, authHeader());
  return res.data;
};
export const getSubmissionHistory = async (params = {}) => {
  const res = await api.get("/submissions/history", { ...authHeader(), params });
  return res.data.data;
};
