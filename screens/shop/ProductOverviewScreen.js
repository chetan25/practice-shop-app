import React from 'react';
import { FlatList, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { addToCart} from '../../store/actions/cart';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';

const ProductOverviewScreen = (props) => {
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    
    return <FlatList
      data={products}
      renderItem={itemData => 
        <ProductItem
           imageUrl={itemData.item.imageUrl}
           title={itemData.item.title}
           price={itemData.item.price}
           onViewDetail={() => {
              props.navigation.navigate('ProductDetail', {
                  productId: itemData.item.id,
                  title: itemData.item.title
              })
           }}
          onAddToCart={() => {
              dispatch(addToCart(itemData.item))
            }
          }
        />
      }
    />
}

const styles = StyleSheet.create({

});

ProductOverviewScreen.navigationOptions = (navData) => {
    return  {
        headerTitle: 'All Products',
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
              title='Cart'
              iconName={Platform.OS == 'android' ? 'md-cart' : 'ios-cart'}
              onPress={() => {
                navData.navigation.navigate('Cart')
              }}
            />
          </HeaderButtons>
      }
}

export default ProductOverviewScreen;