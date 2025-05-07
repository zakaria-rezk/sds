import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async getReceive(payload: object) {
    try {
      const response = await axios.get(base_url + "inventory/operation-in", {
        params: payload,
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addReceive(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/operation-in",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getSpecificReceiveFormItem(param: number) {
    try {
      const response = await axios.get(
        base_url + "inventory/operation-in/" + param
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getItemBatches(param: number) {
    try {
      const response = await axios.get(
        base_url + `items/item-batch?item_id=${param}`
      );
      
      return response.data.data;

    } catch (error) {
      throw error;
    }
  },
  async getItemCards(param: number) {
    try {
      const response = await axios.get(
        base_url + `items/items-cards?category_id=${param}`
      );
      
      return response.data.data;

    } catch (error) {
      throw error;
    }
  },
  //   async getDropDownFilterData() {
  //     try {
  //       const response = await axios.get(
  //         env.DOMAIN + "inventory/fetch-item-operations-dropdown-data"
  //       );

  //       return response.data.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   async getFilterdItems(payload: any) {
  //     try {
  //       const response = await axios.get(
  //         env.DOMAIN + "inventory/get-item-batches-with-operation",
  //         {
  //           params: payload,
  //         }
  //       );

  //       return response.data.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   async addItemsToReleaseForm(payload: any) {
  //     try {
  //       const response = await axios.post(
  //         env.DOMAIN + "inventory/operation-out-details",
  //         payload
  //       );
  //     } catch (error) {
  //       throw error;
  //       
  //     }
  //   },
  //   async closeOperation(payload: any) {
  //     
  //     try {
  //       const response = await axios.post(
  //         env.DOMAIN + "inventory/close-operation",
  //         payload
  //       );
  //     } catch (error) {
  //       
  //       throw error;
  //     }
  //   },
  //   async confirmOperation(payload: any) {
  //     try {
  //       const response = await axios.post(
  //         env.DOMAIN + "inventory/operations-confirm",
  //         payload
  //       );
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  async updateItemDetails(payload: any, item_id: number) {
    try {
      const response = await axios.put(
        base_url + "inventory/operation-in-details/" + item_id,
        payload
      );

      
    } catch (error) {
      throw error;
    }
  },
  async addItemBatch(payload: any) {
    try {
      const response = await axios.post(
        base_url + "items/item-batch",
        payload
      );

      
    } catch (error) {
      throw error;
    }
  },
  async deleteItem(item_id: number) {
    try {
      const response = await axios.delete(
        base_url + "inventory/operation-in-details/" + item_id
      );
    } catch (error) {
      throw error;
    }
  },
};
