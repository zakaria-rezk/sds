import axios from "axios";
import env from "@/env";
const base_url = env.DOMAIN;
export default {
  async getBills(payload) {
    console.log(payload, 'payload')
    try {
      const response = await axios.get(
        base_url +
          `purch-apis/purchasing/bill?category_name=${
            payload.category_name || ""
          }&vendor_id=${payload.vendor_id || ""}&payment_type=${
            payload.payment_type || ""
          }&payment_method=${payload.payment_method || ''}
          &bill_type=${payload.bill_type || ''}
          &date_from=${payload.date_from || ''}
          &date_to=${payload.date_to || ''}
          `
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async settlement(id, operation_id) {
    try {
      const response = await axios.post(
        base_url + "purch-apis/purchasing/create-custody-settlement",
        {
          operation_id: operation_id,
          source_payment_id: id,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async addPayment(payload) {
    try {
      const response = await axios.post(
        base_url + "purch-apis/purchasing/payment-history",
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  //   async getSpecificReleaseFormItem(param: number) {
  //
  //     try {
  //       const response = await axios.get(
  //         base_url + "inventory/operation-stocktaking/" + param
  //       );
  //
  //       return response.data.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   async getDropDownFilterData() {
  //     try {
  //       const response = await axios.get(
  //         base_url + "inventory/fetch-item-operations-dropdown-data"
  //       );

  //       return response.data.data;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  
  async getBillWithItems(payload: any) {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/bill/${payload}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getChequesUnrelated(vendor_id) {
    console.log(vendor_id)
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/cheque?recipient_id=${vendor_id}&bill_id=0`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async PaymentTypes() {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/payment-type`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async updateItemDetails(payload: any, item_id: any) {
    try {
      const response = await axios.put(
        base_url + "purch-apis/purchasing/bill-details/" + item_id,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async editBill(payload: any, item_id: any) {
    try {
      const response = await axios.put(
        base_url + "purch-apis/purchasing/bill/" + item_id,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
