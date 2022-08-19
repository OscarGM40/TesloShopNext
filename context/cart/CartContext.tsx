import { createContext, Dispatch } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartAction } from './CartReducer';

interface CartProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;
  // orders
  createOrder: () => Promise<{ hasError: boolean; message: string}>;
  dispatch: Dispatch<CartAction>;
}

export const CartContext = createContext({} as CartProps);
