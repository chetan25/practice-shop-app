import { LOGIN, SIGN_UP, AUTHENTICATE, LOG_OUT } from '../actions/auth';
 
const initialState = {
    token: null,
    userID: null
}

 
export default (state= initialState, action) =>  {
    switch(action.type) {
        case LOGIN:
            return {
                token: action.token,
                userId: action.userId
            }
        case SIGN_UP:
            return {
                token: action.token,
                userId: action.userId
            }
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId
            }  
        case LOG_OUT: 
           return initialState;    
        default:
            return state;        
    }
}
