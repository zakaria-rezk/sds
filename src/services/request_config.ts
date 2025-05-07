import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import env from "@/env";
import { useToast } from "vue-toast-notification";
import i18n from "@/plugins/i18n";
const toast = useToast();
axios.defaults.baseURL = env.DOMAIN || process.env.VUE_APP_API_BASE_URL || "";
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("TOKEN_KEY");
    if (token) {
      config.headers = (config.headers || {}) as AxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<never> => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      toast.error(i18n.global.t("toast.timeout_error"), {
        position: "top-right",
        duration: 5000,
        pauseOnHover: true,
      });
    } else if (error.response) {
      const data = error.response.data;
    
      const skippableMessages = [
        "No data found.",
        "No operations found for the given criteria.",
        "No operations found for the specified location."
      ];
    
      if (
        data &&
        typeof data === "object" &&
        "message" in data
      ) {
        const errorMsg = (data as any).message;
    
        if (!skippableMessages.includes(errorMsg)) {
          console.log(errorMsg, "errrrrrooooooor");
          toast.error(i18n.global.t("global_error"), {
            position: "top-right",
            duration: 5000,
            pauseOnHover: true,
          });
          return Promise.reject(error);
        } else {
          // silently skip the error and don't throw
          console.warn("Skipped toast for message:", errorMsg);
          return;
        }
      } else {
        // response exists but not a skippable or known structure
        toast.error(i18n.global.t("global_error"), {
          position: "top-right",
          duration: 5000,
          pauseOnHover: true,
        });
        return Promise.reject(error);
      }
    } else {
      console.error("A network error occurred:", error.message);
      return Promise.reject(error);
    }
    
    
    
  }
);

export default axios;
