import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addbundle(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/bundles-group",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateBundle(payload: any, operation_id: number) {
    try {
      await axios.put(
        base_url + `items/bundles-group/${operation_id}`,
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async getbundles() {
    try {
      const response = await axios.get(base_url + "items/bundles-group");

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
