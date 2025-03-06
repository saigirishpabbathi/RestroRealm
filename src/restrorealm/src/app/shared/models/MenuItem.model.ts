export interface MenuItem {
  id: number;
  image: string;
  name: string;
  description: string;
  basePrice: number;
  calories: number;
  unavailable?: boolean;
  isNew?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  quantity?: number;
  customizations?: Array<{
    name: string;
    choices: Array<{
      id: number;
      name: string;
      priceAdjustment: number;
      selected?: boolean;
    }>
  }>;
  imageUrl?: string;
  createdAt?: any;
}
