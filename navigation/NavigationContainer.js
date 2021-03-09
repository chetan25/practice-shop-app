import React, { useEffect, useRef } from 'react';
import ShopNavigator from './ShopNavigator';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';
 
const NavigationContainer = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const navRef = useRef();
    
    useEffect(() => {
       if (!isAuth) {
           // with ref we can access the Navigator Component and it's funcion
         navRef.current.dispatch(NavigationActions.navigate({
            routeName: 'Authenticate'
         }));
       }
    }, [isAuth]);

    return <ShopNavigator ref={navRef} />
}

export default NavigationContainer;