import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrderScreen';
import EditProductScreen from '../screens/user/EditProductScreen'; 
import UserProductScreen from '../screens/user/UserProductScreen';
import Colors from '../constants/Colors';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartUpScreen';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle:{
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsNavigator = createStackNavigator({
  ProductsOverview: ProductOverviewScreen,
  ProductDetail: ProductDetailScreen,
  Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
         />
    },
    defaultNavigationOptions: defaultNavOptions
});

const OrderNavigator = createStackNavigator({
  Orders: OrderScreen
}, {
   navigationOptions: {
       drawerIcon: drawerConfig => <Ionicons
         name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
         size={23}
         color={drawerConfig.tintColor}
        />
   },
   defaultNavigationOptions: defaultNavOptions
});

const AdminrNavigator = createStackNavigator({
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
  }, {
     navigationOptions: {
         drawerIcon: drawerConfig => <Ionicons
           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
           size={23}
           color={drawerConfig.tintColor}
          />
     },
     defaultNavigationOptions: defaultNavOptions
  });

const ShopNavigator  = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrderNavigator,
    Admin: AdminrNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex: 1, paddingTop: 20}}>
               <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerNavigatorItems {...props} />
                    <Button
                        title="Log Out"
                        color={Colors.primary}
                        onPress={() => {
                            dispatch(logOut());
                            // props.navigation.navigate('Authenticate');
                        }}
                    />
               </SafeAreaView>
            </View>
        );
    }
});

const AuthNavigator = createStackNavigator({
    Authenticate: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
   Startup: StartupScreen,
   Authenticate: AuthNavigator,
   Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);