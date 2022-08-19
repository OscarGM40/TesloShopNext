import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await ProductModel.find().sort({ title: 'asc' }).lean();
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
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct;
  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: 'Id not valid' });
  }
  if (images.length < 2) {
    return res.status(400).json({ message: '2 images minimun are needed' });
  }
  try {
    await db.connect();
    const product = await ProductModel.findById(_id);
    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe producto con ese id' });
    }
    // eliminar fotos en Cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId, extension] = image
          .substring(image.lastIndexOf('/') + 1)
          .split('.');
        await cloudinary.uploader.destroy('teslo-shop/' + fileId);
      }
    });
    await product.update(req.body);
    await db.disconnect();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({ message: 'Revisar logs del servidor' });
  }
};
const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;
  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'A Product needs at least 2 images ' });
  }
  try {
    await db.connect();
    const productInDb = await ProductModel.findOne({ slug: req.body.slug });
    if (productInDb) {
      return res
        .status(400)
        .json({ message: 'A Product with same slug already exists' });
    }
    const product = await new ProductModel(req.body).save();
    await db.disconnect();
    return res.status(201).json(product);
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: 'Revisar logs del servidor' });
  }
};