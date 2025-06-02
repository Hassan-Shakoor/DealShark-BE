// utils/api.ts
import axios, { HttpStatusCode } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AsyncStorageKey } from "@/app/utils/constant";
import { ROUTES } from "@/app/utils/routes";
import Toast from "react-native-toast-message";

export const api = axios.create({
  baseURL: "https://fantasy-app-bwf0.onrender.com",
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: add auth token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AsyncStorageKey.Token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      // 🔒 Clear token
      await AsyncStorage.removeItem(AsyncStorageKey.Token);

      // 🔁 Redirect to login
      router.replace(ROUTES.SignIn);

      // 🔁 Optional: Show message
      Toast.show({
        type: "error",
        text1: "Session expired.",
        text2: "Please log in again.",
      });
      console.warn("Session expired. Redirecting to login.");
    }

    return Promise.reject(error); // Keep other errors intact
  },
);
