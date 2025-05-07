export interface ItemDetails {
    form_details_id: number | null;
    form_id: number | null;
    form_item_batch_location_id: number | null;
    quantity_before_operation: number | null;
    form_quantity: number | null;
    form_status: number | null;
    item_batch_location_id: number;
    item_batch_id: number;
    quantity: number;
    item_card_id: number;
    exp_date: string;
    unit_cost: number;
    total_cost: number;
    batch_num: string;
    barcode: string;
    production_date: string;
    finishing_level_id: number;
    finishing_level: string;
    item_card_name: string;
    item_sku_code: string;
    item_shape_id: number;
    item_origin_id: number;
    item_material_title_id: number;
    item_material_nicknames: string | null;
    item_category_id: number | null;
    item_category_name: string | null;
  }