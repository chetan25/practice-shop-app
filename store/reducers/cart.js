import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/order';
import CartItem from '../../models/cart-item';
import {DELETE_PRODUCT} from '../actions/products';

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
           const addedProduct = action.product;
           if (state.items[addedProduct.id]) {
             const updatedItem = new CartItem(
                state.items[addedProduct.id].quantity + 1,
                addedProduct.price,
                addedProduct.title,
                addedProduct.price  + state.items[addedProduct.id].sum
             );

             return {
                 ...state,
                 items: {
                     ...state.items,
                    [addedProduct.id]: updatedItem
                 },
                 totalAmount: state.totalAmount + addedProduct.price
             }
            } else {
               const newItem  = new CartItem(
                   1,
                   addedProduct.price,
                   addedProduct.title,
                   addedProduct.price
               );

               return {
                   ...state,
                   items: {
                       ...state.items,
                       [addedProduct.id]: newItem
                   },
                   totalAmount: state.totalAmount + addedProduct.price
               }
            }
        case REMOVE_FROM_CART:
            const productId = action.productId;
            const selectedItem = state.items[productId];
            const currentQty = selectedItem.quantity;
            if (currentQty > 1) {
                const updatedItem = new CartItem(
                    selectedItem.quantity - 1,
                    selectedItem.price,
                    selectedItem.title,
                    selectedItem.sum - selectedItem.price
                )
                return {
                    ...state,
                    items: {
                        ...state.items,
                        [productId]: updatedItem
                    },
                    totalAmount: state.totalAmount - selectedItem.price
                }
            } else {
               const updatedItems = {...state.items};
               const selectedItem = state.items[productId];
               delete updatedItems[productId];

               return {
                   ...state,
                   items: updatedItems,
                   totalAmount: state.totalAmount - selectedItem.price
               }
            } 
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            const productIdToDelete = action.productId;
            if (!state.items[productIdToDelete]) {
                return state;
            }
            const updatedItems = {
                ...state.items
            };
            const itemTotal = state.items[productIdToDelete].sum;
            delete updatedItems[productIdToDelete];

            return {
               ...state,
               items: updatedItems,
               totalAmount: state.totalAmount - itemTotal
            }    
    }
    return state;
}
