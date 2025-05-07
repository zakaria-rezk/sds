import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addItem(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/items-cards",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async getItems(payload: any, pageNumber: number = 1) {
    try {
      const response = await axios.get(
        base_url + `items/items-cards?page=${pageNumber}`,
        {
          params: payload,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  async getItem(item_id: number) {
    try {
      const response = await axios.get(
        base_url + `items/items-cards/${item_id}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
