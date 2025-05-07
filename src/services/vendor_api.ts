import axios from "axios";
import env from "@/env";

export default {
  async getsuppliers(payload) {
    try {
      const response = await axios.get(
        env.DOMAIN +
          `purch-apis/purchasing/creditors?category=${
            payload.category_name || ""
          }&name=${payload.name || ""}&tax_card=${payload.tax_card || ""}
          &commercial_record=${payload.commercial_record || ""}
          &bank_account=${payload.bank_account || ""}
          `
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getVendorDetails(vendor_id) {
    try {
      const response = await axios.get(
        env.DOMAIN + `purch-apis/purchasing/creditors/${vendor_id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addsupplier(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "purch-apis/purchasing/creditors/",
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async edit_supplier(payload: any, row_id: any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `purch-apis/purchasing/creditors/${row_id}`,
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
