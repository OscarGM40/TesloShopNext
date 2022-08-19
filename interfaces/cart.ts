import { ValidGender, ValidSize } from '../database/seed-data';

export interface ICartProduct {
  _id: string;
  image: string;
  price: number;
  size?: ValidSize;
  inStock?:number;
  slug: string;
  title: string;
  gender: ValidGender;
  quantity: number;
}
