import { db } from '.';
import { IProduct } from '../interfaces';
import { ProductModel } from '../models';

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();
  const product = await ProductModel.findOne({ slug })
    .select('-updatedAt')
    .lean();
  await db.disconnect();

  if (!product) return null;
  //  realizar procesamiento de las imagenes desde el Saas
  product.images = product.images.map((image) => {
    return image.includes('http')
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });
  // fijate como serializamos para que sea una deepcopy
  return JSON.parse(JSON.stringify(product));
};

export const getAllProductsSlugs = async (): Promise<
  Array<{ slug: string }>
> => {
  await db.connect();
  const slugs = await ProductModel.find().select('slug').lean();
  await db.disconnect();
  // retorna esto [{slug:''}]
  return slugs;
};

export const getProductsByTerm = async (
  term: string
): Promise<Array<IProduct>> => {
  await db.connect();

  const products = await ProductModel.find({ $text: { $search: term } })
    .select('title images price inStock slug -_id')
    .lean();

  await db.disconnect();
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
  return updatedProducts;
};

export const getAllProducts = async (): Promise<Array<IProduct>> => {
  await db.connect();

  const products = await ProductModel.find()
    .select('title images price inStock slug -_id')
    .lean();

  await db.disconnect();
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('http')
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });
  return JSON.parse(JSON.stringify(updatedProducts));
};
