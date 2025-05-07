import locations_api from "@/services/inventory/locations_api";

interface Location {
  location_id: number;
  location_name: string;
  location_type: string;
  location_operations: any;
  locations: Record<string, string | number>[];
}
const state: Location = {
  location_id: null,
  location_name: null,
  location_type: null,
  location_operations: null,
  locations: [],
};
const getters = {
  LocationId: (state: Location) => {
    return state.location_id;
  },
  locationName: (state: Location) => {
    return state.location_name;
  },
  LocationType: (state: Location) => {
    return state.location_type;
  },
  LocationOperations: (state: Location) => {
    return state.location_operations;
  },
  Locations: (state: any) => {
    return state.locations;
  },
};
const actions = {
  async user_location({ commit }, payload: any) {
    commit("SET_USER_LOCATION", payload);
  },
  async locations({ commit }, payload: any) {
    try {
      const response = await locations_api.getLocations();
      commit("SET_LOCATIONS", response);
    } catch (error) {
      throw error;
    }
  },
  async location_operations({ state, commit }) {
    try {
      const response = await locations_api.getLoactionOperations(
        state.location_id
      );
      console.log(response, 'sdsdsdsds')
      commit("SET_LOCATION_OPERATIONS", response);
    } catch (error) {
      throw error;
    }
  },
};
const mutations = {
  SET_LOCATIONS(state: any, payload: Location) {
    state.locations = payload;
  },
  SET_USER_LOCATION(state: any, payload: Location) {
    state.location_id = payload.location_id;
    state.location_name = payload.location_name;
    state.location_type = payload.location_type;
   
  },
  SET_LOCATION_OPERATIONS(state: any, payload: any) {
    state.location_operations = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
