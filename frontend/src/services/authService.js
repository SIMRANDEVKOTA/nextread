import api from "./api"; // Import the custom connection we made above

const TOKEN_KEY = "token";
const USER_KEY = "user";

const authService = {
  login: async (data) => {
    // sends to: http://localhost:6060/api/auth/login
    const res = await api.post("/auth/login", data);
    if (res.data.token && res.data.user) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (data) => {
    // sends to: http://localhost:6060/api/auth/register
    const res = await api.post("/auth/register", data);
    if (res.data.token && res.data.user) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};

export default authService;