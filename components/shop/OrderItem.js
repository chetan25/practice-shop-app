import React, { useState } from 'react';
import { Button, StyleSheet, Text, View} from 'react-native';
import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../ui/Card';

const OrderItem = (props) => {
    const [showDetail, setShowDetail] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}> 
                <Text style={styles.amount}>${props.amount.toFixed()}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button 
              color={Colors.primary} title={!showDetail ? 'Show Detail' : 'Hide Details'}
              onPress={() => setShowDetail(prevState => !prevState)}
            />
            {
                showDetail &&
                <View style={styles.detailItem}>
                  {
                      props.items.map(cartItem => <CartItem
                        key={cartItem.productKey}
                        quantity={cartItem.quantity}
                        amount={cartItem.sum}
                        title={cartItem.title}
                      />)
                  }
                </View>
            }
        </Card>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       width: '100%',
       marginBottom: 15
    },
    amount: {
       fontFamily: 'open-sans-bold',
       fontSize: 16
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 16,
        color: '#888'
    },
    detailItem: {
        width: '100%'
    }
});

export default OrderItem;