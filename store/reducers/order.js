import { ADD_ORDER } from '../actions/order';
import Order from '../../models/oreder';

const initialState = {
    orders: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_ORDER:
            const newOrder = new Order(
                new Date().toString(),
                action.orderData.amount,
                new Date(),
                action.orderData.items
           );
        return {
            ...state,
            orders: state.orders.concat(newOrder)
        }   
    }
    return state;
}