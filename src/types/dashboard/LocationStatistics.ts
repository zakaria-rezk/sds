export interface StatusCounts {
  Open: number;
  Close: number;
  Confirmed: number;
  PQ_Open: number;
  PQ_Confirmed: number;
}
export interface OperationStatistics {
  operation_type: string;
  operation_name: string;
  operation_loc_id: number;
  status_counts: StatusCounts;
}

// Example usage:
