import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addOrigin(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/materials-origin",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateOrigin(payload: any, operation_id: number) {
    try {
      await axios.put(
        base_url + `items/materials-origin/${operation_id}`,
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async getOrigins() {
    try {
      const response = await axios.get(base_url + "items/materials-origin");

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
