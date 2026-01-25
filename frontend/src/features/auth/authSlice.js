import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload;

      // Handle both nested {user, token} and flat { ...user, token } structures
      if (payload.user && payload.token) {
        state.user = payload.user;
        state.token = payload.token;
      } else {
        const { token, ...user } = payload;
        state.user = user;
        state.token = token;
      }

      state.isAuthenticated = true;
      if (state.token) {
        localStorage.setItem('token', state.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
