import AppConstants from "./app_constants";

export default class EnvConstants {
  static readonly PORT = Number(process.env.PORT ?? 3000);
  static readonly APP_ENV =
    process.env.NEXT_PUBLIC_APP_ENV ?? AppConstants.DEVELOPMENT;

  static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  static isDev() {
    return EnvConstants.APP_ENV === AppConstants.DEVELOPMENT;
  }

  static isProd() {
    return EnvConstants.APP_ENV === AppConstants.PRODUCTION;
  }

  static isStage() {
    return EnvConstants.APP_ENV === AppConstants.STAGE;
  }
}
