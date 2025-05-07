export interface SourceItem {
    id: number;
    item_sku_code: string;
    item_material_id: number;
    shape_id: number;
    origin_id: number;
    item_parent: number | null;
    bundle_id: number;
    length: number;
    width: number;
    thick_height: number;
    Weight: number;
    is_new: boolean | null;
    uom_id: number | null;
  }
  
  export interface Creator {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface BundleData {
    id: number;
    bundle_serial: string;
    created_at: string;
    created_by: number;
    source_item_id: number;
    source_item: SourceItem;
    creator: Creator;
  }
  