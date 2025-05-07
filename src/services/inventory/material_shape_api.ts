import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addShape(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/materials-shape",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateShape(payload: any, operation_id: number) {
    try {
      const response = await axios.put(
        base_url + `items/materials-shape/${operation_id}`,
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getShapes() {
    try {
      const response = await axios.get(base_url + "items/materials-shape");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
