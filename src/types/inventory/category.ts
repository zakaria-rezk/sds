interface Shape {
  id: number;
  shape_name: string;
  category_id: number;
  desc: string;
}

interface Title {
  id: number;
  category_id: number;
  material_nicknames: string;
}

export default interface Category {
  id: number;
  cat_name: string;
  cat_parent: number | null;
  is_single_value: number;
  status: number;
  parent_category: string | null;
  shapes: Shape[] | [];
  titles: Title[] | [];
}
