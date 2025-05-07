import api from "@/services/authentication_api";

interface RootState {
  user: any | null;
  token: string | null;
  user_name: string | null;
  location_name: string | null;
}
const state: RootState = {
  user: null,
  token: null,
  user_name: null,
  location_name: null,
};
const getters = {
  isAuth: (state: any) => {
    return !!state.token;
  },
  locationName: (state: any) => {
    return state.location_name;
  },
  userName: (state: any) => {
    return state.user_name;
  },
};
const actions = {
  Login({ commit }, payload: any) {
    return new Promise((resolve, reject) => {
      api
        .setLogin(payload)
        .then((r) => {
          commit("SET_LOGIN", r);
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  Logout({ commit }) {
    commit("SET_LOGOUT");
  },
  SetLocationName({ commit }, payload: string) {
    commit("SET_LOCATION_NAME", payload);
  },
  SetUserName({ commit }, payload: string) {
    commit("SET_USER_NAME", payload);
  },
};
const mutations = {
  SET_LOGIN(state: RootState, payload: any) {
    state.token = payload.data.data.token;
    localStorage.setItem("TOKEN_KEY", payload.data.data.token);
  },
  SET_LOGOUT(state: RootState) {
    state.token = null;
  },
  SET_LOCATION_NAME(state: RootState, payload: string) {
    state.location_name = payload;
  },
  SET_USER_NAME(state: RootState, payload: string) {
    state.user_name = payload;
  },
};

export default { namespaced: true, state, actions, getters, mutations };
