import AppConstants from "@/constants/app_constants";

class Helpers {
  static getTextFieldValidation = ({
    value,
    type,
  }: {
    value?: string;
    type?: string;
  }) => {
    if (type == "password") {
      if (!value) return "This field is required";
      if (value.length < AppConstants.PASSWORD_MIN_LENGTH) {
        return `Field must be at least ${AppConstants.PASSWORD_MIN_LENGTH} long`;
      }
    }

    if (type == "email") {
      if (!value) return "This field is required";
      if (!value.includes("@")) return "Invalid email entered";
    }

    return null;
  };
}

export default Helpers;
