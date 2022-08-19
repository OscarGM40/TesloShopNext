import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { OrderModel, ProductModel } from '../../../models';

type Data = { message: string } | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { total, orderItems } = req.body as IOrder;

  // 1 verificar que hay un usuario logeado
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthenticated.Go elsewhere' });
  }

  // 2 crear un arreglo con los ids de los productos a comprar
  const productsIds = orderItems.map((p) => p._id);
  await db.connect();
  const dbProducts = await ProductModel.find({
    _id: { $in: productsIds },
  }).lean();

  // 3 comprobar subTotal con los datos del back y no del front
  try {
    const subTotal = orderItems.reduce((prev, curr) => {
      const currentPrice = dbProducts.find(
        (p) => new mongoose.Types.ObjectId(p._id).toString() === curr._id
      )?.price;
      if (!currentPrice) {
        throw new Error(`Verifique el carrito de nuevo.Producto no existe`);
      }
      return currentPrice * curr.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0);
    const backendTotal = subTotal + subTotal * taxRate;
    if (total !== backendTotal) {
      throw new Error(`El total no cuadra entre front y back`);
    }
    // 4 si llegamos aqui esta todo correcto en la orden
    const userId = session.user._id;
    const newOrder = new OrderModel({
      ...req.body,
      isPaid: false,
      user: userId,
    });
    newOrder.total = Math.round(newOrder.total * 100)/100; //toFixed(2) 
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res
      .status(400)
      .json({ message: error.message || 'Revise logs en el servidor' });
  }

  return res.status(201).json(req.body);
};
