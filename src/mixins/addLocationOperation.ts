import axios from "axios";
import env from "@/env";
export const addLocatinoOperationMixin = {
  methods: {
    async addLocationOperation(operation_id: number) {
      this.disabledBtns.add(operation_id);
      const payload = {
        location_id: +this.routeParams.id,
        operation_id: operation_id,
        status: 1,
      };

      try {
        const response = await axios.post(
          env.DOMAIN + "inv-apis/settings/loc-operations",
          payload
        );
  
      } catch (error) {
        throw error;
      } finally {
        this.disabledBtns.delete(operation_id);
      }
    },
    async reomveLocationOperation(link_id: number) {
      const payload = {
        status: 0,
      };
      try {
        const response = await axios.put(
          env.DOMAIN + `inv-apis/settings/loc-operations/${link_id}`,
          payload
        );
  
      } catch (error) {
        
        throw error;
      } finally {
      }
    },
  },
};
