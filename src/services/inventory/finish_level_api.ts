import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addLevel(payload: any) {
    try {
      const response = await axios.post(
        base_url + "settings/finishing-levels",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateLevel(payload: any, operation_id: number) {
    try {
      await axios.put(
        base_url + `settings/finishing-levels/${operation_id}`,
        payload
      );
    } catch (error) {
      
      throw error;
    }
  },
  async getLevels() {
    try {
      const response = await axios.get(base_url + "settings/finishing-levels");

      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
