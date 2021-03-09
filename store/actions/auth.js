import { AUTH_URL, API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOG_OUT = 'LOG_OUT';
export const USER_DATA_ACCESSOR = 'userData';

let timer;

export const authenticate = (userId, token, expirationTime) => {

   return async dispatch => {
      dispatch(setLogoutTimer(expirationTime));
      
      dispatch({
         type: AUTHENTICATE,
         userId: userId,
         token: token
      })
   }   
}

export const signUp = (email, password) => {
   return async dispatch => {
       const response = await fetch(
           `${AUTH_URL}:signUp?key=${API_KEY}`,
           {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
           }
       );
       
       if(!response.ok) {
         const errorResData = await response.json();
         const errorId = errorResData.error.message;
         let message = 'Something went wrong';
         if (errorId === 'EMAIL_EXISTS') {
            message = 'This email already exists';
         }
        
         throw new Error(message);
      }

        const resData = await response.json();
        
        dispatch(setLogoutTimer(parseInt(resData.expiresIn) * 1000));

        dispatch({
          type: SIGN_UP,
          token: resData.idToken, 
          userId: resData.localId
        });

        const expirationDate = new Date(new Date().getTime() + (parseInt(resData.expiresIn) * 1000));
        saveDataToStorage( resData.idToken, resData.localId, expirationDate, parseInt(resData.expiresIn));
   }
}

export const login = (email, password) => {
   return async dispatch => {
       const response = await fetch(
           `${AUTH_URL}:signInWithPassword?key=${API_KEY}`,
           {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
           }
       );
       
        if(!response.ok) {
           const errorResData = await response.json();
           const errorId = errorResData.error.message;
           let message = 'Something went wrong';
           if (errorId === 'EMAIL_NOT_FOUND') {
              message = 'This email is not found';
           }
           if (errorId === 'INVALID_PASSWORD') {
              message = 'This password is not valid';
           }
           throw new Error(message);
         }

        const resData = await response.json();

        dispatch(setLogoutTimer(parseInt(resData.expiresIn) * 1000));

        dispatch({
          type: LOGIN,
          token: resData.idToken, 
          userId: resData.localId
        });

        const expirationDate = new Date(new Date().getTime() + (parseInt(resData.expiresIn) * 1000));
        saveDataToStorage( resData.idToken, resData.localId, expirationDate, parseInt(resData.expiresIn));
   }
}

export const logOut = () => {
   clerLogoutTimer();
   clearStorage(); // this returns a promise but we are not intrested in result, so we don't await
   
   return {
      type: LOG_OUT
   }
}

// store data on device, persists data on app relaunches
const saveDataToStorage = (token, userId, expirationDate, expiresIn) => {
   AsyncStorage.setItem(USER_DATA_ACCESSOR, JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
      expiresIn: expiresIn * 1000
   }))
}

const clearStorage = () => {
   AsyncStorage.removeItem(USER_DATA_ACCESSOR);
};

const setLogoutTimer = (expirationTime) => {
   return dispatch => {
      // issue in android https://github.com/facebook/react-native/issues/12981
      timer = setTimeout(() => {
         dispatch(logOut());
      }, expirationTime);
   }
}

const clerLogoutTimer = () => {
   if (timer) {
      clearTimeout(timer);
   }
}