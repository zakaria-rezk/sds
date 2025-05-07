import { createStore } from "vuex";
import authentication_module from "@/Middelware/Collection/authentication_module";
import location_module from "@/Middelware/Collection/location_module";
import { localStoragePlugin } from "@/plugins/localStoragePlugin"; // Import plugin
export interface RootState {}

export default createStore<RootState>({
  modules: {
    authentication_module,
    location_module,
  },
  plugins: [localStoragePlugin],
});
