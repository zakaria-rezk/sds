import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addOperation(payload: any) {
    try {
      const response = await axios.post(
        base_url + "settings/setting-operations",
        payload
      );
      
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
  },  async getOperationTypes() {
    try {
      const response = await axios.get(
        base_url + "settings/get-operation-types"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  async updateStatus(link_id: number, payload: any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `inv-apis/settings/loc-operations/${link_id}`,
        payload
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async updateOperation(payload: any, operation_id: number) {
    try {
      
      const response = await axios.put(
        env.DOMAIN + `inv-apis/settings/setting-operations/${operation_id}`,
        payload
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  deleteOperation(operation_id: number) {
    // try {
    //   axios.delete(env.DOMAIN + `settings/setting-operations/${operation_id}`);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   throw error;
    // }
  },
};
