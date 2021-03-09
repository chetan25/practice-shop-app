import React from 'react';
import { FlatList, StyleSheet, Platform, Button, Alert, View, Text } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import COlors from '../../constants/Colors';
import { deleteProduct } from '../../store/actions/products';

const UserProductScreen = (props) => {
   const userProducts = useSelector(state => state.products.userProducts);
   const dispatch = useDispatch();

   const editProduct = (id) => {
       props.navigation.navigate('EditProduct', {
         productId: id
       })
   }

   const deleteHandler = (id) => {
    Alert.alert('Delete Item', 'Are you sure, do you want to delete item', [
        {text: 'No', style: 'default'},
        {text: 'Yes', style: 'destructive', onPress: () => {dispatch(deleteProduct(id))} }
    ]);
   }

  if (userProducts.length === 0) {
     return (
       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No products found, add your first product </Text></View>
     );
  }

   return <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => <ProductItem 
         title={itemData.item.title}
         price={itemData.item.price}
         imageUrl={itemData.item.imageUrl}
         onSelect={() => {editProduct(itemData.item.id)}}
        >
          <Button
            color={COlors.primary}
            title='Edit'
            onPress={() => {editProduct(itemData.item.id)}}
          />
          <Button 
            color={COlors.primary}
            title='Delete'
            onPress={() => { deleteHandler(itemData.item.id) }}
          />
        </ProductItem>}
    />
}

const styles = StyleSheet.create({

});

UserProductScreen.navigationOptions = (navData) => {
    return  {
        headerTitle: 'Your Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Cart'
            iconName={Platform.OS == 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>,
         headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
         <Item
           title='Add'
           iconName={Platform.OS == 'android' ? 'md-create' : 'ios-create'}
           onPress={() => {
             navData.navigation.navigate('EditProduct')
           }}
         />
       </HeaderButtons>,
      }
}
export default UserProductScreen;