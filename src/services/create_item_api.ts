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
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getItmeDropDownData() {
    try {
      const response = await axios.get(
        base_url + "items/fetch-items-dropdown-data"
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getOperation() {
    try {
      const response = await axios.get(
        base_url + "settings/setting-operations"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  updateItem(payload: any, item_id: number) {
    try {
      const response = axios.put(
        base_url + "items/items-cards/" + item_id,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  addItemImgs(payload: any) {
    try {
      const response = axios.post(base_url + "items/media", payload);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteImg(img_id: number) {
    try {
      const response = axios.delete(base_url + `items/media/${img_id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
