import axios from "axios";
import env from "@/env";
const base_url = env.DOMAIN;
export default {
  async getCheques(payload) {
    try {
      const params = new URLSearchParams();
  
      if (payload.recipient_name) {
        params.append("recipient_name", payload.recipient_name);
      }
      if (payload.cheque_number) {
        params.append("cheque_number", payload.cheque_number);
      }
      if (payload.bank_name) {
        params.append("bank_name", payload.bank_name);
      }
      if (payload.created_from) {
        params.append("created_from", payload.created_from);
      }
      if (payload.created_to) {
        params.append("created_to", payload.created_to);
      }
      if (payload.maturity_from) {
        params.append("maturity_from", payload.maturity_from);
      }
      if (payload.maturity_to) {
        params.append("maturity_to", payload.maturity_to);
      }
      if (payload.cashing_from) {
        params.append("cashing_from", payload.cashing_from);
      }
      if (payload.cashing_to) {
        params.append("cashing_to", payload.cashing_to);
      }
      if (payload.status||payload.status==0) {
        params.append("status", payload.status);
      }
     
  
      const response = await axios.get(
        `${base_url}purch-apis/purchasing/cheque?${params.toString()}`
      );
  
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },  
  async getChequeFiles(type, id) {
    try {
      const response = await axios.get(
        base_url +
          `purch-apis/purchasing/upload-form-files?operation_type=${type}&form_id=${id}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getChequeHistory(id) {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/cheque/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getBankAccounts() {
    try {
      const response = await axios.get(
        base_url + `purch-apis/purchasing/bank-accounts`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async addCheque(payload) {
    try {
      const response = await axios.post(
        base_url + "purch-apis/purchasing/cheque",
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async EditCheque(payload, id) {
    try {
      const response = await axios.put(
        base_url + `purch-apis/purchasing/cheque/${id}`,
        payload
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async changeChequeStatus(id, action_date, status) {
    try {
      const response = await axios.put(
        base_url + `purch-apis/purchasing/cheque/${id}`,
        {
          action_date: action_date,
          status: status,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
