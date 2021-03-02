import React, { useState} from 'react';
import {StyleSheet, View, Button, FlatList, Text, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import { removeFromCart } from '../../store/actions/cart';
import { addOrder } from '../../store/actions/order'; 
import Card from '../../components/ui/Card';

const CartScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const cartAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const items = [];
        for(const key in  state.cart.items) {
            items.push({
                productKey: key,
                title: state.cart.items[key].title,
                price: state.cart.items[key].price,
                quantity: state.cart.items[key].quantity,
                sum:  state.cart.items[key].sum
            });
        }
        return items.sort((a,b) => a.productKey > b.productKey ? 1 : 1);
    });
    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(addOrder(cartItems, cartAmount));
        setIsLoading(false);
    }

    return (
       <View style={styles.screen}>
           <Card style={styles.summary}>
               <Text style={styles.summaryText}>Total: <Text style={styles.amount}>${Math.round(cartAmount.toFixed(2) * 100) / 100}</Text> </Text>
               { isLoading ?
                   <ActivityIndicator size='small' color={Colors.primary} />
                  :  <Button
                  color={Colors.accent}
                  title='Order Now'
                  disabled={cartItems.length == 0}
                  onPress={sendOrderHandler}
                />
               }
           </Card>
           <FlatList
              data={cartItems}
              keyExtractor={item => item.productKey}
              renderItem={itemData => <CartItem
                     quantity={itemData.item.quantity}
                     title={itemData.item.title}
                     amount={itemData.item.sum}
                     canDelete
                     onRemove={() => dispatch(removeFromCart(itemData.item.productKey))}
                  />
              }
            />
       </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
       fontFamily: 'open-sans-bold',
       fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
});

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
 }
 
export default CartScreen;