import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

type Data = { message: string } | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return searchProductsByQuery(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

async function searchProductsByQuery(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = req.query['query'].toString() ?? "";
  const regex = new RegExp(req.query['query'] as string, 'i');

  await db.connect();
  if(query.length === 0){
    return res.status(400).json({message:'Debe especificar el parámetro de busqueda'})
  }
  const productsFound = await ProductModel
    // .find({ $or: [{ title: {regex} },{tags: {$in: [regex]}}]})
    .find( { $text: { $search: query }})
    .select('title images price inStock slug gender -_id')
    .lean();
  await db.disconnect();
  return res.status(200).json(productsFound)
}
