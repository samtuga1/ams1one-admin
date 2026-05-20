import { Bounce, toast } from "react-toastify";

class ToastService {
  static info = ({ text }: { text: string }) => {
    toast.info(text, {
      position: "top-right",
      autoClose: 5000,
      className: "text-xs",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  static error = ({ text }: { text: string }) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      className: "text-xs",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  static success = ({ text }: { text: string }) => {
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      className: "text-xs",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
}

export default ToastService;
