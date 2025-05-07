import axios from "axios";
import env from "@/env";
const base_url = env.DOMAIN + env.INVENTORY;
export default {
  async getAdjustments(payload: object) {
    try {
      const response = await axios.get(
        base_url + "inventory/operation-stocktaking",
        {
          params: payload,
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addAdjustment(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/operation-stocktaking",
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async updateAdjustment(payload: any, operation_id: number) {
    try {
      await axios.put(
        base_url + `inventory/operation-stocktaking/${operation_id}`,
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async getSpecificAdjustmentFormItem(param: number) {
    try {
      const response = await axios.get(
        base_url + "inventory/operation-stocktaking/" + param
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getDropDownFilterData() {
    try {
      const response = await axios.get(
        base_url + "items/dropdown-items-data-filtering"
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getFilterdItems(payload: any, pageNumber: number = 1) {
    try {
      const response = await axios.get(
        base_url +
          `inventory/get-item-batches-with-operation?page=${pageNumber}`,
        {
          params: payload || {},
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addItemsToStokingForm(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/operation-stocktaking-details",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async closeOperation(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/close-operation",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async confirmOperation(payload: any, location_type: any) {
    try {
      if (location_type == "purchasing") {
        const response = await axios.post(
          "purch-apis/purchasing/operations-confirm",
          payload
        );
      } else {
        const response = await axios.post(
          base_url + "inventory/operations-confirm",
          payload
        );
      }
    } catch (error) {
      throw error;
    }
  },
  async reopenOperation(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/reopen-operation",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteItem(item_id: number) {
    try {
      const response = await axios.delete(
        base_url + "inventory/operation-stocktaking-details/" + item_id
      );
    } catch (error) {
      throw error;
    }
  },
  async updateItemDetails(payload: any, item_id: number) {
    try {
      const response = await axios.put(
        base_url + "inventory/operation-stocktaking-details/" + item_id,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
