import EnvConstants from "@/constants/env_constants";
import useAuth from "@/stores/auth.store";
import axios from "axios";
import AuthService from "./auth";
import { IAuth } from "@/interfaces/auth.interface";

const Axios = axios.create({
  baseURL: EnvConstants.API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // withCredentials: true,
    // "ngrok-skip-browser-warning": "true",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const { auth } = useAuth.getState();

    if (auth?.access) {
      config.headers.Authorization = `Bearer ${auth.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { auth, setAuth } = useAuth.getState();
    const originalRequest = error.config;

    // if refresh token expires
    if (
      error?.response?.status === 401 &&
      originalRequest.url?.includes("/auth/token/refresh")
    ) {
      logout();
      return Promise.reject(error);
    }

    // if access token expires
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      auth?.refresh
    ) {
      originalRequest._retry = true;

      try {
        const newTokens = await AuthService.refreshToken(
          auth?.refresh as string,
        );

        // Add the new token to the request header
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

        setAuth({
          ...(auth as IAuth),
          access: newTokens.access,
          refresh: auth?.refresh as string,
        });

        return AuthService.request(originalRequest);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  },
);

const logout = () => {
  useAuth.getState().removeAuth();
  window.location.href = "/";
};

export default Axios;
