export default interface Operation {
  id: number;
  operation_name_ar: string;
  operation_name_en: string;
  operation_parent: string | null;
  operation_type: "IN" | "OUT" | "RETURN_IN" | "RETURN_OUT" | "RFQ" | "GRD";
  parent_operation: string | null;
  reference_doc_type: string;
}
