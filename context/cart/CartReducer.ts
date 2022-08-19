import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';

export type CartAction =
  | {
      type: '[Cart] - LoadCart from cookies | storage';
      payload: ICartProduct[];
    }
  | { type: '[Cart] - Update Cart'; payload: ICartProduct[] }
  | { type: '[Cart] - Change Cart quantity'; payload: ICartProduct }
  | { type: '[Cart] - Remove product in Cart'; payload: ICartProduct }
  | { type: '[Cart] - Load address from cookie'; payload: ShippingAddress }
  | { type: '[Cart] - Update shipping address'; payload: ShippingAddress }
  | {
      type: '[Cart] - Update order summary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | { type: '[Cart] - Order complete' };

export const cartReducer = (state: CartState, action: CartAction) => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case '[Cart] - Load address from cookie':
    case '[Cart] - Update shipping address':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case '[Cart] - Update Cart':
      return {
        ...state,
        cart: [...action.payload],
      };
    case '[Cart] - Change Cart quantity':
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) {
            return product;
          }
          if (product.size !== action.payload.size) {
            return product;
          }
          return action.payload; // puedo mandar lo nuevo
        }),
      };
    case '[Cart] - Remove product in Cart':
      /*      const index = state.cart.findIndex((product) => 
        product._id === action.payload._id &&
          product.size === action.payload.size
      ); */
      return {
        ...state,
        // cart: index !== -1 ? state.cart.filter((x, i) => i !== index) : state.cart,
        cart: state.cart.filter(
          (p) =>
            !(p._id === action.payload._id && p.size === action.payload.size)
        ),
      };
    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload,
      };
    case '[Cart] - Order complete':
      return {
        ...state,
        cart:[],
        numberOfItems: 0,
        subTotal:0,
        tax:0,
        total:0
      }
    default:
      return state;
  }
};
