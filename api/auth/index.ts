import { IAuth, ILogInRequest, IMyPagesResponse } from "@/interfaces/auth.interface";
import Axios from "..";
import { handleApiError } from "@/utils/api_error";
import { InternalAxiosRequestConfig } from "axios";
import { IUser } from "@/interfaces/user.interface";

class AuthService {
  static login = async (payload: ILogInRequest): Promise<IAuth> => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/login`,
        method: "POST",
        data: payload,
      });

      return response.data as unknown as IAuth;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static refreshToken = async (refreshToken: string) => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/token/refresh`,
        method: "POST",
        data: {
          refresh: refreshToken,
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static request = async (originalRequest: InternalAxiosRequestConfig) => {
    return Axios.request(originalRequest);
  };

  static fetchProfile = async (): Promise<IUser> => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/me`,
        method: "GET",
      });

      return response.data as unknown as IUser;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  static fetchMyPages = async (): Promise<string[] | "*"> => {
    try {
      const response = await Axios({
        url: `/api/v1/auth/me/pages/`,
        method: "GET",
      });
      return (response.data as IMyPagesResponse).pages;
    } catch (error) {
      throw handleApiError(error);
    }
  };
}

export default AuthService;
