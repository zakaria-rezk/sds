import axios from "axios";
import env from "@/env";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addCategory(payload: any) {
    try {
      const response = await axios.post(base_url + "items/categories", payload);
      
    } catch (error) {
      throw error;
    }
  },
  async getCategories() {
    try {
      const response = await axios.get(base_url + "items/categories");

      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async updateCategory(payload: any, operation_id: number) {
    try {
      
      const response = await axios.put(
        base_url + `items/categories/${operation_id}`,
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async changeCategoryStatus(activeStatus: any, category_id: number) {
    try {
      const response = await axios.put(
        env.DOMAIN + `inv-apis/items/categories/${category_id}`,
        activeStatus
      );
    } catch (error) {
      
      throw error;
    }
  },
};
