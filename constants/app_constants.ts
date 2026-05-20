export default class AppConstants {
  static readonly DEVELOPMENT = "development";
  static readonly STAGE = "test";
  static readonly PRODUCTION = "production";

  static readonly PASSWORD_MIN_LENGTH = 1;

  static readonly TEST = {} as const;
}

export type TEST_KEY = keyof typeof AppConstants.TEST;
