import axios from "axios";
import env from "@/env";
const base_url = env.DOMAIN ;
export default {
  async getCustosyForPq(payload) {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/custody?form_id=${payload.form_id}`,
        
      );
      
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async getCustosyForCustody(payload) {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/custodies/user/${payload.form_id}`,
        
      );
      
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async getRecipients(payload: object) {
    try {
      const response = await axios.get(
        base_url + "purch-apis/purchasing/custody-recipients",
        {
          params: payload,
        }
      );
      
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async getUsers() {
    try {
      const response = await axios.get(
        base_url + "inv-apis/users",
        
      );
      
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  },
  async addCustody(payload: any) {
    try {
      const response = await axios.post(
        base_url + "purch-apis/purchasing/custody",
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
//   async getFilterdItems(payload: any) {
//     try {
//       const response = await axios.get(
//         base_url + "inventory/get-item-batches-with-operation",
//         {
//           params: payload,
//         }
//       );
      
//       return response.data.data;
//     } catch (error) {
//       throw error;
//     }
//   },
//   async addItemsToStokingForm(payload: any) {
//     try {
//       const response = await axios.post(
//         base_url + "inventory/operation-stocktaking-details",
//         payload
//       );
//     } catch (error) {
//       throw error;
//     }
//   },
//   async closeOperation(payload: any) {
//     
//     try {
//       const response = await axios.post(
//         base_url + "inventory/close-operation",
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
//         base_url + "inventory/operations-confirm",
//         payload
//       );
//     } catch (error) {
//       throw error;
//     }
//   },
//   async reopenOperation(payload: any) {
//     try {
//       const response = await axios.post(
//         base_url + "inventory/reopen-operation",
//         payload
//       );
//       
//     } catch (error) {
//       throw error;
//     }
//   },
//   async deleteItem(item_id: number) {
//     try {
//       const response = await axios.delete(
//         base_url + "inventory/operation-stocktaking-details/" + item_id
//       );
//     } catch (error) {
//       throw error;
//     }
//   },
//   async updateItemDetails(payload: any, item_id: number) {
//     try {
//       const response = await axios.put(
//         base_url +
//           "inventory/operation-stocktaking-details/" +
//           item_id,
//         payload
//       );

//       return response.data.data;
//     } catch (error) {
//       throw error;
//     }
//   },
};
