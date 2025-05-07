import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async getStatistics(payload: any) {
    try {
    
      const response = await axios.get(
        base_url + "inventory/reports/count-operations-status-by-location",
        { params: payload }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getInboxOperations(payload: any) {
    try {
      const response = await axios.get(
        base_url + "inventory/reports/inbox-operations-status-by-location",
        { params: payload }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
