import PRODUCTS from '../../data/products';
import {DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCT} from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: [],
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PRODUCT:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts,
            }
        case DELETE_PRODUCT:
            const productId = action.productId;

            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== productId),
                availableProducts: state.availableProducts.filter(product => product.id !== productId)
            }
        case CREATE_PRODUCT:
            const product = action.productData;
            const newProuct = new Product(
                product.id,
                product.ownerId,
                product.title,
                product.imageUrl,
                product.description,
                product.price
            );

            return {
                ...state,
                userProducts: state.userProducts.concat(newProuct),
                availableProducts: state.availableProducts.concat(newProuct)
            }
        case UPDATE_PRODUCT:
            const productData = action.productData;
            const productIdToUpdate = action.productId;
            const productIndex = state.userProducts.findIndex(prod => prod.id === productIdToUpdate);
            
            const updatedProuct = new Product(
                productIdToUpdate,
                state.userProducts[productIndex].ownerId,
                productData.title,
                productData.imageUrl,
                productData.description,
                state.userProducts[productIndex].price
            );
 
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProuct;

            const availableProductsIndex = state.availableProducts.findIndex(prod => prod.id === productIdToUpdate);
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductsIndex] = updatedProuct;

            return {
                ...state,
                userProducts: updatedUserProducts,
                availableProducts: updatedAvailableProducts
            }    
    }
    return state;
}