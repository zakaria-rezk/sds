import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addTitle(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/material-titles",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async getTitles(cate_id = null) {
    try {
      const response = await axios.get(base_url + "items/material-titles", {
        params: cate_id,
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
