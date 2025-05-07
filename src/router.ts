import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
  useRouter,
} from "vue-router";
import AuthRoute from "@/routes/AuthRoute";
import InventoryRoutes from "@/routes/InventoryRoutes";
import SettingsRoutes from "@/routes/SettingsRoutes";
const authRoutes: Array<RouteRecordRaw> = AuthRoute;
const inventoryRoutes: Array<RouteRecordRaw> = InventoryRoutes;
const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...inventoryRoutes,
  ...SettingsRoutes,
];
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const requiresAuth = to.matched.some((record: RouteRecordNormalized) =>
      Boolean(record.meta.requiresAuth)
    );
    const token = localStorage.getItem("TOKEN_KEY");
    const isAuthenticated = Boolean(token);

    if (!isAuthenticated) {
      localStorage.removeItem("TOKEN_KEY");
  
    }
    if (requiresAuth && !isAuthenticated) {
      return next({ name: "Login" });
    }

    next();
  }
);

export default router;
