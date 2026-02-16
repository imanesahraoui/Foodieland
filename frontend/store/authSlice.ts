import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAdmin: boolean;
  error: string | null;
}


const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};


const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Erreur lors du parsing de l'utilisateur:", error);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isAdmin: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: AdminUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = true;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },

    updateProfileSuccess: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAdmin = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, loginFailure, logout, updateProfileSuccess } = authSlice.actions;
export default authSlice.reducer;