import apiService from "./apiService";

const authService = {
  // Sign in user and store token
  login: async (username, password) => {
    try {
      const response = await apiService.signIn(username, password);
      const { jwtToken, username: userName, role } = response.data;

      // Store token and user info in localStorage
      localStorage.setItem("token", jwtToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: userName, role }),
      );

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await apiService.signUp(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === "ADMIN";
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
