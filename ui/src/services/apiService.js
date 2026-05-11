import axios from "axios";

const API_BASE_URL = "http://localhost:8080/confession-box";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const apiService = {
  // Auth endpoints
  signIn: (username, password) => {
    return apiClient.post("/auth/signin", { username, password });
  },

  signUp: (userData) => {
    return apiClient.post("/auth/signup", userData);
  },

  forgotPassword: (email) => {
    return apiClient.post("/auth/forgot-password", { email });
  },

  // Confession endpoints
  getAllConfessions: () => {
    return apiClient.get("/confessions");
  },

  getConfessionById: (id) => {
    return apiClient.get(`/confessions/${id}`);
  },

  getConfessionsByUserId: (userId) => {
    return apiClient.get(`/confessions/user/${userId}`);
  },

  createConfession: (confessionData) => {
    return apiClient.post("/confessions", confessionData);
  },

  updateConfession: (id, confessionData) => {
    return apiClient.put(`/confessions/${id}`, confessionData);
  },

  updateConfessionStatus: (id, status) => {
    return apiClient.put(`/confessions/${id}/status`, { status });
  },

  deleteConfession: (id) => {
    return apiClient.delete(`/confessions/${id}`);
  },

  // User endpoints
  getAllUsers: () => {
    return apiClient.get("/users");
  },

  getUserById: (id) => {
    return apiClient.get(`/users/${id}`);
  },

  updateUser: (id, userData) => {
    return apiClient.put(`/users/${id}`, userData);
  },

  changePassword: (id, passwordData) => {
    return apiClient.post(`/users/${id}/change-password`, passwordData);
  },

  updateUserStatus: (id, status) => {
    return apiClient.put(`/users/${id}/status`, { status });
  },

  deleteUser: (id) => {
    return apiClient.delete(`/users/${id}`);
  },
};

export default apiService;
