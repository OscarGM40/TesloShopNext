import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

type Data = { message: string } | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(res, req);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
async function getProductBySlug(
  res: NextApiResponse<Data>,
  req: NextApiRequest
) {
  await db.connect();
  const product = await ProductModel.findOne({ slug: req.query['slug'] })
    .select('-_id')
    .lean();
  await db.disconnect();
  if (!product) {
    return res.status(404).json({ message: 'Not product found' });
  }
  product.images = product.images.map((image) => {
    return image.includes('http')
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });
  return res.status(200).json(product);
}
