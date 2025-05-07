import { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/WelcomeView.vue"),
    meta: { showLayout: false, autoOpenSidebar: false, requiresAuth: true },
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: () => import("@/views/WelcomeView.vue"),
    meta: { showLayout: false, autoOpenSidebar: false },
  },
  {
    path: "/auth",
    name: "Auth",
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/AuthView/LoginView.vue"),
        meta: { showLayout: false, autoOpenSidebar: false },
      },
      {
        path: "otp",
        name: "Otp",
        component: () => import("@/views/AuthView/OtpView.vue"),
        meta: { showLayout: false, autoOpenSidebar: false, requiresAuth: true },
      },
    ],
  },
];

export default authRoutes;
