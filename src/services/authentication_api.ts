import axios from "axios";
import env from "@/env";
const base_url = env.DOMAIN + env.INVENTORY;
export default {
  setLogin(payload: any) {
    return new Promise((resolve, reject) => {
      axios
        .post(base_url + "login", payload)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  logout() {
    localStorage.clear();
  },
};
