import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { PropsWithChildren, useContext, useState } from 'react';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { CartContext } from '../../context';
import { dbProducts } from '../../database';
import { ValidSize } from '../../database/seed-data';
import { ICartProduct, IProduct } from '../../interfaces';

interface ProductPageProps {
  product: IProduct;
}
const ProductPage: React.FC<PropsWithChildren<ProductPageProps>> = ({
  product,
}) => {
  const { t } = useTranslation('home');
  const router = useRouter();
  const {addProductToCart} = useContext(CartContext)
  
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    inStock: product.inStock ?? 0,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const handleSelectedSize = (size: ValidSize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const handleQuantity = (quantity: number) => {
    if (tempCartProduct.quantity + quantity === 0) return;
    if (tempCartProduct.quantity + quantity > product.inStock) return;

    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity: currentProduct.quantity + quantity,
    }));
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) { return; }
    addProductToCart(tempCartProduct);
    router.push('/cart')
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        {/* /Product Left side */}
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        {/* /Product Right side */}
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* titulos */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {`$${product.price}`}
            </Typography>
            {/* Quantity */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">
                {t('productQuantity')}
              </Typography>
              <ItemCounter
                handleQuantity={handleQuantity}
                currentValue={tempCartProduct.quantity}
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={handleSelectedSize}
              />
            </Box>
            {/* Agregar al carrito */}
            {product.inStock === 0 ? (
              <Chip
                label={t('notAvailable')}
                color="error"
                variant="outlined"
              />
            ) : (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddProduct}
              >
                {tempCartProduct.size
                  ? t('productAddToCart')
                  : t('productSelectASize')}
              </Button>
            )}
            {/* Description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">
                {t('productDescription')}
              </Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const paths = await dbProducts.getAllProductsSlugs();
  // si la ruta es /:slug tengo que pasar {params:{slug: value}} por cada una
  return {
    paths: paths.map((path) => ({ params: { slug: path.slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // con false los bots de google no indexarán la aplicación
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};
export default ProductPage;
