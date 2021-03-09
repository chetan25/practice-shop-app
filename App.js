import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import productreducer from './store/reducers/products';
import orderReducer from './store/reducers/order';
import cartReducer from './store/reducers/cart';
import AuthReducer from './store/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const reducers = combineReducers({
  products: productreducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: AuthReducer
});

const store = createStore(reducers, applyMiddleware(ReduxThunk));

const loadFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
       <NavigationContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({

});
