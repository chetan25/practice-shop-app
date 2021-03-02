import { ADD_ORDER, SET_ORDER } from '../actions/order';
import Order from '../../models/oreder';

const initialState = {
    orders: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.amount,
                action.orderData.date,
                action.orderData.items
           );
        return {
            ...state,
            orders: state.orders.concat(newOrder)
        }   
        case SET_ORDER:
            console.log()
            return {
                orders: action.orders
            }
    }
    return state;
}