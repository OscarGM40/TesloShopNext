import { FC, useEffect, useReducer } from 'react';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';
import { getAddressFromCookies } from '../../pages/checkout/address';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  // la direccion de envio es opcional
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookie.get('cart') != undefined ? JSON.parse(Cookie.get('cart')!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    const address = getAddressFromCookies();
    // si no viene el nombre,que era obligatorio,es que no viene el form entero
    if (!address.firstName) return;
    dispatch({
      type: '[Cart] - Load address from cookie',
      payload: address,
    });
  }, []);

  useEffect(() => {
    try {
      const oldCart =
        Cookie.get('cart') != undefined ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: oldCart,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, curr) => curr.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, curr) => curr.quantity * curr.price + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal + subTotal * taxRate,
    };
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    // buscar los productos iguales
    const sameProducts = state.cart.filter((p) => p._id === product._id);
    // buscar los que tengan la misma talla
    if (sameProducts.length > 0) {
      const sameSize = sameProducts.filter((p) => p.size === product.size);
      if (sameSize.length > 0) {
        const finalProduct: ICartProduct = {
          ...sameSize[0],
          quantity: sameSize[0].quantity + product.quantity,
        };
        dispatch({
          type: '[Cart] - Update Cart',
          payload: [
            ...state.cart.filter((p) => p.size !== sameSize[0].size),
            finalProduct,
          ],
        });
      } else {
        dispatch({
          type: '[Cart] - Update Cart',
          payload: [...state.cart, product],
        });
      }
    } else {
      dispatch({
        type: '[Cart] - Update Cart',
        payload: [...state.cart, product],
      });
    }
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change Cart quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in Cart', payload: product });
  };

  const updateAddress = (data: ShippingAddress) => {
    Cookies.set('firstName', data.firstName);
    Cookies.set('lastName', data.lastName);
    Cookies.set('address', data.address);
    Cookies.set('address2', data.address2 ?? '');
    Cookies.set('zip', data.zip);
    Cookies.set('city', data.city);
    Cookies.set('country', data.country);
    Cookies.set('phone', data.phone);
    dispatch({ type: '[Cart] - Update shipping address', payload: data });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error(
        `No hay dirección de entrega.Imposible gestionar una orden`
      );
    }
    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };
    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      dispatch({type:'[Cart] - Order complete'})
      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      console.log({ error });
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as { message: string }).message,
        };
      }
      return {
        hasError: true,
        message: 'Server Error,please see server logs',
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state, //fijate que esparzo las props con ...state y los methods de uno en uno
        // methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
