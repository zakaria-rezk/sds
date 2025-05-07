import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async getReturns(payload: object) {
    try {
      const response = await axios.get(base_url + "inventory/operation-rout");

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getSpecificRinFormItem(param: number) {
    try {
      const response = await axios.get(
        base_url + "inventory/operation-rout/" + param
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getInBatches(payload: object) {
    try {
      const response = await axios.get(
        base_url + "inventory/rin/get-in-batches",
        {
          params: payload,
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addRetrun(payload: any) {
    try {
      const response = await axios.post(
        base_url + "inventory/operation-rout",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getInItems(payload: object) {
    try {
      const response = await axios.get(
        base_url + "inventory/operation-in-details",
        {
          params: payload,
        }
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
  async addItemsToRinForm(payload: any) {
    try {
      await axios.post(base_url + "inventory/operation-rout-details", payload);
    } catch (error) {
      throw error;
    }
  },
  // async updateRelease(payload: any, operation_id: number) {
  //   try {
  //     const response = await axios.put(
  //       base_url + `inventory/operation-out/${operation_id}`,
  //       payload
  //     );
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     throw error;
  //   }
  // },
  // async getSpecificReleaseFormItem(param: number) {
  //   try {
  //     const response = await axios.get(
  //       base_url + "inventory/operation-out/" + param
  //     );

  //     return response.data.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async getDropDownFilterData() {
  //   try {
  //     const response = await axios.get(
  //       base_url + "items/dropdown-items-data-filtering"
  //     );

  //     return response.data.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // },
  // async getFilterdItems(payload: any) {
  //   try {
  //     const response = await axios.get(
  //       base_url + "inventory/get-item-batches-with-operation",
  //       {
  //         params: payload || {},
  //       }
  //     );

  //     return response.data.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // async closeOperation(payload: any) {
  //   try {
  //     const response = await axios.post(
  //       base_url + "inventory/close-operation",
  //       payload
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  // async confirmOperation(payload: any) {
  //   try {
  //     const response = await axios.post(
  //       base_url + "inventory/operations-confirm",
  //       payload
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  async updateItemDetails(payload: any, item_id: number) {
    try {
      const response = await axios.put(
        base_url + "inventory/operation-rout-details/" + item_id,
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  // async deleteItem(item_id: number) {
  //   try {
  //     const response = await axios.delete(
  //       base_url + "inventory/operation-out-details/" + item_id
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
