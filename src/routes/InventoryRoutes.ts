import { RouteRecordRaw } from "vue-router";
const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: "/inventory",
    name: "Inventory",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () =>
          import("@/views/InventoryModuleView/LocationDashboardView.vue"),
        meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "showroom",
        children: [
          {
            path: "materials",
            name: "ShowRoom",
            component: () => import("@/views/ShowRoom/ShowRoomView.vue"),
          },
          {
            path: "block/:id",
            name: "materials-details",
            component: () => import("@/views/ShowRoom/ShowRoomDetailsView.vue"),
          },
          {
            path: "batch/:id",
            name: "batches",
            component: () => import("@/views/ShowRoom/BatchesRoomView.vue"),
          },
          {
            path: "batch/history/:id",
            name: "History",
            component: () => import("@/views/ShowRoom/BatcheHistoryView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              requiresAuth: true,
            },
          },
          {
            path: "items",
            name: "Items",
            component: () => import("@/views/ShowRoom/ItemsViews.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              requiresAuth: true,
            },
          },
        ],
        meta: { showLayout: false, autoOpenSidebar: false, requiresAuth: true },
      },
      {
        path: "return",
        children: [
          {
            path: "operation/:operation_id",
            name: "Return",
            component: () =>
              import("@/views/InventoryModuleView/Return/ReturnInView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "return-details/:form_id/:operation_id",
            name: "return-details",
            component: () =>
              import(
                "@/views/InventoryModuleView/Return/ReturnInDetailsView.vue"
              ),
          },
          {
            path: "add-return/:form_id/:operation_id",
            name: "add-return-item",

            component: () =>
              import(
                "@/views/InventoryModuleView/Return/AddReturnItemView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "return-out",
        children: [
          {
            path: "operation/:operation_id",
            name: "Return-Out",
            component: () =>
              import("@/views/InventoryModuleView/Return/ReturnOutView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "return-out-details/:form_id/:operation_id",
            name: "return-out-details",
            component: () =>
              import(
                "@/views/InventoryModuleView/Return/ReturnOutDetailsView.vue"
              ),
          },
          {
            path: "add-return-out/:form_id/:operation_id",
            name: "add-return-out-item",

            component: () =>
              import(
                "@/views/InventoryModuleView/Return/AddReturnOutItemView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      // stocking
      {
        path: "adjustment",
        children: [
          {
            path: "operation/:operation_id",
            name: "Adjustment",
            component: () =>
              import(
                "@/views/InventoryModuleView/Adjustment/AdjustmentView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "adjustment-details/:form_id/:operation_id",
            name: "adjustment-details",
            component: () =>
              import(
                "@/views/InventoryModuleView/Adjustment/AdjustmentDetailsView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "add-adjustment/:form_id/:operation_id",
            name: "add-adjustment-item",

            component: () =>
              import(
                "@/views/InventoryModuleView/Adjustment/AddAdjustmentItemView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      // purchasing
      {
        path: "purchasing",
        children: [
          // RFQ
          {
            path: "RFQ/:operation_id",
            name: "RFQ",
            component: () =>
              import("@/views/InventoryModuleView/Purchasing/RFQsView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "RFQ-details/:form_id/:operation_id",
            name: "RFQ-details",

            component: () =>
              import("@/views/InventoryModuleView/Purchasing/RFQDetails.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "add-RFQ/:form_id/:operation_id",
            name: "add-RFQ-item",

            component: () =>
              import("@/views/InventoryModuleView/Purchasing/AddRFQ.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "purchasing",
        children: [
          // PQ
          {
            path: "PQ/:operation_id",
            name: "PQ",
            component: () =>
              import("@/views/InventoryModuleView/Purchasing/PQsView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "PQ-details/:form_id/:operation_id",
            name: "PQ-details",

            component: () =>
              import("@/views/InventoryModuleView/Purchasing/PQDetails.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "release",
        children: [
          {
            path: "operation/:operation_id",
            name: "Release",
            component: () =>
              import("@/views/InventoryModuleView/Release/ReleaseView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "release-details/:form_id/:operation_id",
            name: "release-details",

            component: () =>
              import(
                "@/views/InventoryModuleView/Release/ReleaseDetailsView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "add-release/:form_id/:operation_id",
            name: "add-release-item",

            component: () =>
              import(
                "@/views/InventoryModuleView/Release/AddReleaseItemView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },

      // receive for zakaria
      {
        path: "receive",
        children: [
          {
            path: "operation/:operation_id",
            name: "Receive",
            component: () =>
              import("@/views/InventoryModuleView/Receive/ReceiveView.vue"),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },

          {
            path: "receive-details/:form_id/:operation_id",
            name: "receive-details",

            component: () =>
              import(
                "@/views/InventoryModuleView/Receive/ReceiveDetailsView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
          {
            path: "operation/:type/:operation_id",
            name: "ImportReceive",
            component: () =>
              import(
                "@/views/InventoryModuleView/Receive/ReceiveImportView.vue"
              ),
            meta: {
              showLayout: true,
              autoOpenSidebar: false,
              isSidebarExist: true,
              requiresAuth: true,
            },
          },
        ],
      },
      // receive operations
      {
        path: "receive-operation/:operation_id",
        name: "Receive-Operation",
        component: () =>
          import("@/views/InventoryModuleView/Purchasing/receiveView.vue"),
      },
      // receive details
      {
        path: "receive-operation-details/:form_id/:operation_id",
        name: "Receive-Operation-Details",
        component: () =>
          import("@/views/InventoryModuleView/Purchasing/receiveDetails.vue"),
      },
      //vendors
      {
        path: "vendors",
        name: "Vendors",
        component: () => import("@/views/Vendors/vendorsView.vue"),
      },
      //vendors
      {
        path: "vendor-details/:form_id/:operation_id",
        name: "Vendors-Details",
        component: () => import("@/views/Vendors/vendorDashboard.vue"),
      },
      //Custody
      {
        path: "Custodys/:operation_id",
        name: "CUSTODY",
        component: () =>
          import("@/views/InventoryModuleView/custody/RecipientsView.vue"),
      },
      {
        path: "Recipient-Custodies/:form_id/:operation_id",
        name: "Recipient-Custodies",
        component: () =>
          import("@/views/InventoryModuleView/custody/custodyView.vue"),
      },
      //Bill
      {
        path: "Bill/:operation_id",
        name: "BILL",
        component: () =>
          import("@/views/InventoryModuleView/bill/billView.vue"),
      },
      // Bill Details
      {
        path: "bill-operation-details/:form_id/:operation_id",
        name: "Bill-Operation-Details",
        component: () =>
          import("@/views/InventoryModuleView/bill/billDetailsView.vue"),
      },
    ],
    meta: { showLayout: true, autoOpenSidebar: false, requiresAuth: true },
  },
  {
    path: "/cheques/:operation_id",
    name: "cheques",
    component: import("@/views/InventoryModuleView/cheques/chequesView.vue"),
  },
  {
    path: "/cheque-details/:form_id/:operation_id",
    name: "cheque-details",
    component: import("@/views/InventoryModuleView/cheques/chequesDetails.vue"),
  },
];

export default inventoryRoutes;
