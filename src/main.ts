import { createApp } from "vue";
import App from "@/App.vue";
import "@/style.css";
import store from "./Middelware/store";

import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import router from "@/router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import clickOutside from "@/directives/outside-click";
import clickEnter from "@/directives/enter-click";
import i18n from "@/plugins/i18n";

import "@/services/request_config";

library.add(fas);
library.add(far);
library.add(fab);

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.directive("click-outside", clickOutside);
app.directive("click-enter", clickEnter);
app.use(i18n);
globalThis.t = i18n.global.t;
app.use(store);
app.use(router);
app.use(ToastPlugin);

app.mount("#app");
