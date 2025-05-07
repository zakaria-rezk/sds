import axios from "axios";
import env from "@/env";
const location = "settings/locations";
const base_url: string = env.DOMAIN + env.INVENTORY;
export default {
  async addLocation(payload: any) {
    try {
      const response = await axios.post(base_url + location, payload);
    } catch (error) {
      throw error;
    }
  },
  async getLocations() {
    try {
      const response = await axios.get(base_url + location);

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async updateLocation(payload: any, location_id: number) {
    
    try {
      
      const response = await axios.put(
        base_url + `settings/locations/${location_id}`,
        payload
      );
      
    } catch (error) {
      
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  deleteLocation(location_id: number) {
    // try {
    //   axios.delete(env + `settings/locations/${location_id}`);
    //   
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   throw error;
    // }
  },
  async getLocationTypes() {
    try {
      const response = await axios.get(base_url + "settings/location-types");

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getLoactionOperations(location_id: number) {
    try {
      const response = await axios.get(base_url + "settings/loc-operations", {
        params: {
          location_id: location_id,
          status: 1,
        },
      });
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
