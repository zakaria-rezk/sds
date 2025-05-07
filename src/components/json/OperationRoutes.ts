import { OperaionsOptions } from "@/types/OperationInput";
export const OperationRoutes: OperaionsOptions[] = [
  {
    route: "Receive",
    text: "operations.operation-type-options.option-1.text",
    type: "IN",
  },
  {
    route: "Release",
    text: "operations.operation-type-options.option-2.text",
    type: "OUT",
  },
  {
    route: "Return",
    text: "operations.operation-type-options.option-3.text",
    type: "Return_In operation",
  },
  {
    route: "Return",
    text: "operations.operation-type-options.option-7.text",
    type: "RETURN_IN",
  },
  {
    route: "Return-Out",
    text: "operations.operation-type-options.option-7.text",
    type: "RETURN_OUT",
  },
  {
    route: "RFQ",
    text: "operations.operation-type-options.option-7.text",
    type: "RFQ",
  },
  {
    route: "PQ",
    text: "ZXczxczxc",
    type: "PQ",
  },
  {
    route: "Adjustment",
    text: "operations.operation-type-options.option-7.text",
    type: "GRD",
  },
  // {
  //   route: "Stocking",
  //   text: "operations.operation-type-options.option-7.text",
  //   type: "RFQ",
  // },
  {
    route: "CUSTODY",
    text: "operations.operations.option-7.text",
    type: "CUSTODY",
  },
  // {
  //   route: "Stocking",
  //   text: "PQ",
  //   type: "PQ",
  // },
  {
    route: "BILL",
    text: "operations.operation-type-options.option-7.text",
    type: "BILL",
  },
];
export const OperationDetailsRoutes: OperaionsOptions[] = [
  {
    route: "RFQ-details",

    type: "RFQ",
  },
  {
    route: "Release",
   
    type: "OUT",
  },
  {
    route: "adjustment-details",
    type: "Adjusmentment",
  },
];
