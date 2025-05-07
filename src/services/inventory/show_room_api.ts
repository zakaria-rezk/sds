import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async getDropdownFilterData(payload: object, pageNumber: number) {
    try {
      const response = await axios.get(
        base_url + `items/get-batch-grouped-materials/?page=${pageNumber}`,
        { params: payload }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getItems(payload: any, pageNumber: number = 1) {
    try {
      const response = await axios.get(
        base_url + `items/item-batch-location-joined?page=${pageNumber}`,
        {
          params: payload || {},
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getBatchesWithDropDown(payload: object, id: number) {
    try {
      const response = await axios.get(
        base_url + `items/get-batches-by-material/${id}`,
        { params: payload }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getBatchDetails(batch_id: number) {
    try {
      const response = await axios.get(base_url + "items/get-item-batch-view", {
        params: { batch_id: batch_id },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getHistory(item_card_id: number) {
    try {
      const response = await axios.get(
        base_url + "items/history-item-operation",
        {
          params: { item_card_id: item_card_id },
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
