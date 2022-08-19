import { SeedProduct } from '../database/seed-data';

export interface IProduct extends SeedProduct {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
