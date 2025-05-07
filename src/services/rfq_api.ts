import axios from "axios";
import env from "@/env";
const stocking = "inventory/operation-stocktaking";
export default {
  async getRFQs(payload) {
    try {

      const response = await axios.get(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq?status[]=0&status[]=1&status[]=2&status[]=4&from_location[]=${payload.from_location}`,
      );
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async getPQs(payload) {
    try {
      const response = await axios.get(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq?status[]=2&status[]=3&status[]=4&to_location[]=${payload.to_location}`
      );

      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async getReceivedOrders() {
    try {
      const response = await axios.get(
        env.DOMAIN + "inv-apis/inventory/operation-in"
      );

      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async addRfq(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "purch-apis/purchasing/operation-rfq",
        payload
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async EditRFQ(payload: any, row_id:any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq/${row_id}`,
        payload
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async updateVendors(payload: any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `purch-apis/purchasing/rfq-details/update-vendors`,
        payload
      );
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getRfqWithItems(param: number) {
    
    try {
      const response = await axios.get(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq/${param}`
      );
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getPQWithItems(param: number) {
    
    try {
      const response = await axios.get(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq/${param}`
      );
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getReceivedWithItems(param: number) {
    
    try {
      const response = await axios.get(
        env.DOMAIN + `inv-apis/inventory/operation-in/${param}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getDropDownFilterData() {
    try {
      const response = await axios.get(
        env.DOMAIN + "inv-apis/items/dropdown-items-data-filtering"
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getLocationData() {
    try {
      const response = await axios.get(
        env.DOMAIN + `inv-apis/settings/locations?location_type=purchasing`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getCategoies() {
    try {
      const response = await axios.get(
        env.DOMAIN + `inv-apis/items/categories`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getFilterdItems(payload: any) {
    try {
      const response = await axios.get(
        env.DOMAIN + "inv-apis/items/items-cards",
        {
          params: payload,
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addItemsToRFQForm(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "purch-apis/purchasing/operation-rfq-details",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async duplicateRow(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "purch-apis/purchasing/duplicate-rfq-details",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async closeOperation(payload: any) {
    
    try {
      const response = await axios.post(
        env.DOMAIN + "inv-apis/inventory/close-operation",
        payload
      );
    } catch (error) {
      
      throw error;
    }
  },
  async confirmOperation(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "inv-apisinventory/operations-confirm",
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  async updateItemDetails(payload: any, item_id: any) {
    try {
      const response = await axios.put(
        env.DOMAIN + "purch-apis/purchasing/operation-rfq-details/" + item_id,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async updatePQDetails(payload: any, item_id: any) {
    try {
      const response = await axios.put(
        env.DOMAIN + "purch-apis/purchasing/operation-rfq-details/" + item_id,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async convertRfqToPq(form_id:any, operation_id:any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `purch-apis/purchasing/rfq/${form_id}/convert-rfq-pq`, 
        {
          operation_id : operation_id
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async generateCustody(source_form_id:any, operation_id:any) {
    try {
      const response = await axios.post(
        env.DOMAIN + `purch-apis/purchasing/create-custody-from-rfq`, 
        {
          operation_id : operation_id,
          source_form_id : source_form_id
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async generateBillFromReceive(source_form_id:any, operation_id:any) {
    try {
      const response = await axios.post(
        env.DOMAIN + `purch-apis/purchasing/bill/generate-bill-from-receive-operation`, 
        {
          operation_id : operation_id,
          source_form_id : source_form_id
        }
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async receiveOrder(payload:any) {
    try {
      const response = await axios.post(
        env.DOMAIN + `inv-apis/inventory/create-in-from-RFQ`,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async uploadFiles(payload:any) {
    try {
      const response = await axios.post(
        env.DOMAIN + `purch-apis/purchasing/upload-form-files/`,
        payload
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteImage(id:any) {
    try {
      const response = await axios.delete(
        env.DOMAIN + `purch-apis/purchasing/upload-form-files/${id}`,
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteOperation(id:any) {
    try {
      const response = await axios.delete(
        env.DOMAIN + `purch-apis/purchasing/operation-rfq-details/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async ConvertPQToPO(form_id:any) {
    try {
      const response = await axios.put(
        env.DOMAIN + `purch-apis/purchasing/pq/${form_id}/confirm`
      );

      return response.data.data;
    } catch (error) {
      // console.log(error.response.data.message)
      throw error.response.data.message;
    }
  },
};
