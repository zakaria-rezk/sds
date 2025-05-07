interface item {
  id: number;
  name: string;
}

interface CreateItmeDropDown {
  item_material: item[];
  shape: item[];
  origin: item[];
  bundle: item[];
}
export default CreateItmeDropDown;
