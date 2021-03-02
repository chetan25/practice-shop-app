import Order from "../../models/oreder";
import { BASE_URL } from '@env';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDER  = 'SET_ORDER';

export const addOrder = (cartItems, totalAmount) => {
    return async dispatch => {
        const orderDate = new Date();
        const response = await fetch(`${BASE_URL}/orders/u1.json`, {
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: orderDate.toISOString()
            })
          });
       
        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const resData = await response.json();
   
        dispatch({
            type: ADD_ORDER,
            orderData: {
                date: orderDate,
                id: resData.name,
                items: cartItems,
                amount: totalAmount
            }
        });
    }
}

export const fetchOrders = () => {
    return async dispatch => {
        try {
            const response = await fetch(`${BASE_URL}/orders/u1.json`);
            if (!response.ok) {
              throw Error('Error fetching products');
            }
            const resData = await response.json();
            const loadedOrders = [];
            for(const key in resData) {
              loadedOrders.push(new Order(
                  key,
                  resData[key].totalAmount,
                  new Date(resData[key].date),
                  resData[key].cartItems,
              ));
            }
            console.log(loadedOrders, 'loadedOrders')
            dispatch({
              type: SET_ORDER,
              orders: loadedOrders
            });
          } catch (err) {
            // handle error
            throw err;
          }
    }
}