import Product from "../../models/product";
import { BASE_URL } from '@env';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `${BASE_URL}/products/${productId}.json?auth=${token}`, {
      method: 'DELETE',
    });

    dispatch({
      type: DELETE_PRODUCT,
      productId: productId
    });
  }  
}

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // can execute any async code, and redux thunk will handle all async
    // firebase specific syntax
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(`${BASE_URL}/products.json?auth=${token}`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageUrl,
        ownerId: userId
      })
    });
 
    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        ownerId: userId
      }
    })
  }
}

export const updateProduct = (pid, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    // thunk gives us second argument that is a function that returns store
      const token = getState().auth.token;

      const response = await fetch(
          `${BASE_URL}/products/${pid}.json?auth=${token}`, {
        method: 'PATCH',
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      });
 
      if (!response.ok) {
        throw new Error('Error updating');
      }

      dispatch({
        type: UPDATE_PRODUCT,
        productId: pid,
        productData: {
          title: title,
          description: description,
          imageUrl: imageUrl
        }
      });
  }
}

export const fetchProduct = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(`${BASE_URL}/products.json`);
      if (!response.ok) {
        throw Error('Error fetching products');
      }
      const resData = await response.json();

      const loadedPoducts = [];
      for(const key in resData) {
        loadedPoducts.push(new Product(
          key,
          resData[key].ownerId,
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          parseFloat(resData[key].price)
        ));
      }
      dispatch({
        type: SET_PRODUCT,
        products: loadedPoducts,
        userProducts: loadedPoducts.filter(product => product.ownerId === userId)
      });
    } catch (err) {
      // handle error
      throw err;
    }
  }
}