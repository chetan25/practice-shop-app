import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { useDispatch } from 'react-redux';
import { fetchOrders } from '../../store/actions/order';
import Colors  from '../../constants/Colors';

const OrderScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    
    const loadOrders = async () => {
      setIsLoading(true);
      await dispatch(fetchOrders());
      setIsLoading(false);
    };
    useEffect(() => {
      loadOrders();
    }, [dispatch]);

    useEffect(() => {
      // will only fire after the first render
      const willFocusSub = props.navigation.addListener('willFocus',  loadOrders);

      return () => {
        willFocusSub.remove();
      }
    }, [loadOrders])

    if (isLoading) {
      return <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary}/>
      </View>
    }

    if (orders.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No orders found, add your first order </Text>
        </View>
      );
   }

    return (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={itemData => <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
          />}
        />
    );

}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

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