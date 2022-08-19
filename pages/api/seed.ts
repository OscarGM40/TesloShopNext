import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { OrderModel, ProductModel, UserModel } from '../../models';

type CustomResponse = {
  message: string;
};

export default async function (
  _: NextApiRequest,
  res: NextApiResponse<CustomResponse>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      message: 'No tiene acceso a este servicio',
    });
  }
  await db.connect();
  await ProductModel.deleteMany();
  await ProductModel.insertMany(seedDatabase.initialData.products);
  await UserModel.deleteMany();
  await UserModel.insertMany(seedDatabase.initialData.users);
  await OrderModel.deleteMany();
  await db.disconnect();
  res.status(200).json({ message: 'Proceso realizado correctamente!' });
}
