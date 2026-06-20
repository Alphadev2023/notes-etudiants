import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Intercepteur de requête : injecte le token JWT ───
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Intercepteur de réponse : gère les erreurs globales ───
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    const message =
      error.response?.data?.message ||
      Object.values(error.response?.data?.errors ?? {})[0] ||
      "Une erreur est survenue";

    return Promise.reject(new Error(message));
  },
);

// Pour les téléchargements binaires (PDF, Excel)
export const apiClientBlob = axios.create({
  baseURL: API_URL,
  responseType: "blob",
});

apiClientBlob.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
