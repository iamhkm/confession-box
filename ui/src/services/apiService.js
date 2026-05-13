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

  getActiveConfessions: () => {
    return apiClient.get("/confessions/active");
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

  // User Profile endpoints (authenticated users)
  getMyProfile: () => {
    return apiClient.get("/users/me");
  },

  updateMyProfile: (userData) => {
    return apiClient.put("/users/me", userData);
  },

  changeMyPassword: (passwordData) => {
    return apiClient.post("/users/me/change-password", passwordData);
  },

  // Admin - User Management endpoints
  getAllUsers: () => {
    return apiClient.get("/admin/users");
  },

  getUserById: (id) => {
    return apiClient.get(`/admin/users/${id}`);
  },

  createUser: (userData) => {
    return apiClient.post("/admin/users", userData);
  },

  updateUserStatus: (id, status) => {
    return apiClient.put(`/admin/users/${id}/status`, { status });
  },

  deleteUser: (id) => {
    return apiClient.delete(`/admin/users/${id}`);
  },
};

export default apiService;
