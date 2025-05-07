import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addUnitOfMeasurement(payload: any) {
    try {
      const response = await axios.post(
        base_url + "settings/unit-of-measurement",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateUnit(payload: any, operation_id: number) {
    try {
      
      const response = await axios.put(
        base_url + `settings/unit-of-measurement/${operation_id}`,
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getUnitOfMeasurement() {
    try {
      const response = await axios.get(
        base_url + "settings/unit-of-measurement"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
