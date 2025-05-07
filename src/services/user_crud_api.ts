import axios from "axios";
import env from "@/env";

const token = localStorage.getItem("TOKEN_KEY");
export default {
  async getUsers() {
    try {
      const response = await axios.get(env.DOMAIN + "inv-apis/users");

      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
    }
  },
  async loggedUserLocations() {
    try {
      const response = await axios.get(env.DOMAIN + "inv-apis/logged_user");
      
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
    }
  },
  async addUser(payload: any) {
    try {
      const response = await axios.post(env.DOMAIN + "inv-apis/register", payload);
      
    } catch (error) {
      throw error;
    }
  },
  async updateUser(payload: any, user_id: number) {
    
    try {
      
      const response = await axios.put(
        env.DOMAIN + `inv-apis/settings/users/${user_id}`,
        payload
      );
      
    } catch (error) {
      
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  deleteUser(user_id: number) {
    try {
      axios.delete(env.DOMAIN + `inv-apis/settings/users/${user_id}`);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async addToLocatoin(payload: any) {
    try {
      const response = await axios.post(
        env.DOMAIN + "inv-apis/settings/location-users",
        payload
      );
      
    } catch (error) {
      throw error;
    }
  },
  async removeFromLocatoin(link_id: any) {
    try {
      const response = await axios.delete(
        env.DOMAIN + `inv-apis/settings/location-users/${link_id}`
      );
    } catch (error) {
      throw error;
    }
  },
  async getlinkId(payload: any) {
    try {
      const response = await axios.get(env.DOMAIN + "inv-apis/settings/location-users", {
        params: payload,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  async getUserLocations(user_id: number) {
    try {
      const response = await axios.get(env.DOMAIN + `inv-apis/users/${user_id}`);
      return response.data.data.user_details;
    } catch (error) {
      throw error;
    }
  },
  async changeUserState(payload: any, user_id: number) {
    try {
      const response = await axios.put(
        env.DOMAIN + `users/${user_id}`,
        payload
      );
    } catch (error) {
      throw error;
    }
  },
  getUserData() {
    return new Promise((resolve, reject) => {
      axios
        .post(env.DOMAIN + "inv-apis/logged_user", {})
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
