// store/authStore.js
import { create } from "zustand";
import LogRegApi from "../api/LogReg";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // login function
  login: async (user, navigate) => {
    try {
      set({ loading: true, error: null });
      const res = await LogRegApi.post("/user/login", user);
      if(res.data.success){
        localStorage.setItem('marioNation', res.data.token);
        set({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
        });
        console.log("Loggin", res.data.user)
        navigate('/admin')
      }
    } catch (err) {
      set({
        error: err.response?.data?.error || "Login failed",
        loading: false,
      });
    }
  },

  // logout function
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
