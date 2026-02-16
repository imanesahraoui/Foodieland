"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { loginSuccess } from "@/store/authSlice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user && user !== "undefined") {
      try {
        store.dispatch(loginSuccess({ token, user: JSON.parse(user) }));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}