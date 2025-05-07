import { RouteRecordRaw } from "vue-router";

const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: "/settings",
    name: "settings",
    children: [
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/Settings/SettingsView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "operations",
        name: "Operations",
        component: () => import("@/views/Settings/OperationsView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "locations",
        name: "Locations",
        component: () => import("@/views/Settings/LocationsView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/Settings/UsersView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },

      {
        path: "settings/users/:name/:id",
        name: "UserProfile",
        component: () => import("@/views/Settings/UserProfileView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "settings/locations/:name/:id",
        name: "LocationDetails",
        component: () => import("@/views/Settings/LocationsDetailsView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "itemssettings",
        name: "ItemsSettings",
        component: () => import("@/views/ItemsSettings/ItemsSettingsView.vue"),
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/views/ItemsSettings/CategoriesView.vue"),
      },
      {
        path: "bundle",
        name: "Bundle",
        component: () => import("@/views/ItemsSettings/BundleGroupView.vue"),
      },
      {
        path: "material-shape",
        name: "Material",
        component: () => import("@/views/ItemsSettings/MaterialShapeView.vue"),
      },
      {
        path: "uom",
        name: "UnitOfMeasurement",
        component: () =>
          import("@/views/ItemsSettings/UnitOfMeasurementView.vue"),
      },
      {
        path: "finish",
        name: "FinishLevel",
        component: () => import("@/views/ItemsSettings/FinishLevelView.vue"),
      },
      {
        path: "material-origin",
        name: "MaterialOrigin",
        component: () => import("@/views/ItemsSettings/MaterialOriginView.vue"),
      },
      {
        path: "material-title",
        name: "MaterialTitle",
        component: () => import("@/views/ItemsSettings/MaterialTitlesView.vue"),
      },
      {
        path: "items",
        name: "ItemBatch",
        component: () => import("@/views/ItemsSettings/ItemBatchView.vue"),
      },
      {
        path: "create-item/:item_id?/:form_id?/:operation_id?",
        name: "CreateItem",
        component: () => import("@/views/ItemsSettings/CreateItemView.vue"),
      },
    ],
    meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
  },
];

export default inventoryRoutes;
