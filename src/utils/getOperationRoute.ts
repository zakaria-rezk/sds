import { OperationRoutes,OperationDetailsRoutes } from "@/components/json/OperationRoutes";

export const getRoute = (operation: string) => {
  const el = OperationRoutes.find((el) => {
    return el.type === operation;
  });

  return el.route;
};
export const getDetailsRoute = (operation: string) => {
  const el = OperationDetailsRoutes.find((el) => {
    return el.type === operation;
  });
  return el.route;
};
