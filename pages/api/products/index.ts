import type { NextApiRequest, NextApiResponse } from 'next';
import { SHOP_CONSTANTS } from '../../../common';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

type Data = { message: string } | Array<IProduct>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    default:
      return res.status(400).json({
        message: 'Bad request',
      });
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  let products: Array<IProduct> = [];

  await db.connect();
  if (
    req.query['gender'] &&
    SHOP_CONSTANTS.validGenders.includes(req.query['gender'] as string)
  ) {
    products = await ProductModel.find({ gender: req.query['gender'] })
      .select('title images price gender inStock slug -_id')
      .lean();
  } else if (
    req.query['gender'] &&
    !SHOP_CONSTANTS.validGenders.includes(req.query['gender'] as string)
  ) {
    return res.status(200).json([]);
  } else {
    products = await ProductModel.find()
      .select('title images price gender inStock slug -_id')
      .lean();
  }
  await db.disconnect();
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
  return res.status(200).json(updatedProducts);
}
