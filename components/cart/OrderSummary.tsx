import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}
export const OrderSummary: FC<Props> = ({ orderValues }) => {

  const { numberOfItems, subTotal, tax, total } = orderValues ? orderValues : useContext(CartContext);

  
  return (
    <Grid container={true}>
      {/* ROW */}
      <Grid item={true} xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item={true} xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? 'items' : 'item'}
        </Typography>
      </Grid>
      {/* ROW */}
      <Grid item={true} xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item={true} xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>
      {/* ROW */}
      <Grid item={true} xs={6}>
        <Typography>
          IVA ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item={true} xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(tax)}</Typography>
      </Grid>
      {/* ROW */}
      <Grid item={true} xs={6}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item={true} xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{currency.format(total)}</Typography>
      </Grid>
    </Grid>
  );
};
