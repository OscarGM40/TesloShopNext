import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import useTranslation from 'next-translate/useTranslation';
import { FC, useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CartList: FC<Props> = ({ editable = 'false', products = [] }) => {
  const { t } = useTranslation('home');
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const onNewCartQuantityValue = (
    product: ICartProduct,
    newQuantity: number
  ) => {
    if (product.quantity + newQuantity === 0) return;
    if (product.quantity + newQuantity > product.inStock! ?? 0) return;
    product.quantity += newQuantity;
    updateCartQuantity(product);
  };

  const productsToShow = products.length > 0 ? products : cart;
  /* console.log({cart})
  console.log({productsToShow});   */
  return (
    <>
      {hasMounted &&
        productsToShow.map((product) => (
          <Grid
            container
            spacing={2}
            sx={{ mb: 1 }}
            key={product.slug + product.size}
          >
            <Grid item xs={3}>
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={product.image}
                      component="img"
                      sx={{ borderRadius: '5px' }}
                    ></CardMedia>
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1">{product.title}</Typography>
                <Typography variant="body1">
                  Talla: <strong>{product.size}</strong>
                </Typography>
                {/* Condicional */}
                {editable ? (
                  <ItemCounter
                    currentValue={product.quantity}
                    handleQuantity={(value: number) =>
                      onNewCartQuantityValue(product as ICartProduct, value)
                    }
                  />
                ) : (
                  <Typography variant="h5">{`${product.quantity} ${
                    product.quantity > 1 ? 'productos' : 'producto'
                  }`}</Typography>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="subtitle1">{`$${product.price}`}</Typography>
              {editable && (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => removeCartProduct(product as ICartProduct)}
                >
                  {t('cartListRemove')}
                </Button>
              )}
            </Grid>
          </Grid>
        ))}
    </>
  );
};
