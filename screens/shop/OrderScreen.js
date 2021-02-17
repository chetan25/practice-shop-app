import React from 'react';
import { FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrderScreen = () => {
    const orders = useSelector(state => state.orders.orders);
    console.log(orders, 'orders');

    return (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={itemData => <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
          />}
        />
    );

}

OrderScreen.navigationOptions = navData => {
    return {
      headerTitle: 'Your Orders',
      headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Cart'
          iconName={Platform.OS == 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    } 
}

export default OrderScreen;