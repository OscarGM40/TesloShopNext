import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { OrderModel, ProductModel, UserModel } from '../../../models';

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();
  /*   const numberOfOrders = await OrderModel.count();
  const paidOrders = await OrderModel.find({ isPaid: true }).count();
  const notPaidOrders = numberOfOrders - paidOrders;
  const numberOfClients = await UserModel.find({role: 'client'}).count();
  const numberOfProducts = await ProductModel.count();
  const productsWithNoInventory = await ProductModel.find({
    inStock: 0,
  }).count();
  const lowInventory = await ProductModel.find({
    inStock: { $lte: 10 },
  }).count(); */

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    OrderModel.count(),
    OrderModel.find({ isPaid: true }).count(),
    UserModel.find({ role: 'client' }).count(),
    ProductModel.count(),
    ProductModel.find({ inStock: 0 }).count(),
    ProductModel.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders:numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
}
