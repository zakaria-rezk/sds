interface ItemCard {
  location_id: number;
  uom_id: number;
  id?: number; // Optional in case it's generated server-side
  item_name: string;
  item_sku_code?: string;
  item_material_id: number;
  shape_id: number;
  origin_id: number;
  bundle_id: number;
  media: any;
  length: number;
  width: number;
  thick_height: number;
  weight: number;
  current_operation?: number;
}
export default ItemCard;
