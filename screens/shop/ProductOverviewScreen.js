import React, { useState, useEffect, useCallback } from 'react';
import { Text, FlatList, StyleSheet, Platform, Button, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { addToCart} from '../../store/actions/cart';
import { fetchProduct } from '../../store/actions/products';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import COlors from '../../constants/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ProductOverviewScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshin, setIsRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    const selectItem = (productId, title) => {
      props.navigation.navigate('ProductDetail', {
        productId: productId,
        title: title
      })
    };

    const loadProducts = useCallback(async () => {
      setHasError(false);
      setIsRefreshing(true);
      try {
        await dispatch(fetchProduct());
      } catch(err) {
        setHasError(true)
      }
      setIsRefreshing(false);
    }, [dispatch]);

    useEffect(() => {
      setIsLoading(true);
      loadProducts().then(res =>  setIsLoading(false));
    }, [loadProducts]);

    useEffect(() => {
      // will only fire after the first render
      const willFocusSub = props.navigation.addListener('willFocus',  loadProducts);

      return () => {
        willFocusSub.remove();
      }
    }, [loadProducts])

    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
      )
    }

    if (!isLoading && hasError) {
      return (
        <View style={styles.centered}>
          <Text>Error Occured</Text>
          <Button title='Try Again' color={Colors.primary} onPress={loadProducts} />
        </View>
      )
    }

    if (!isLoading && products.length == 0) {
      return (
        <View style={styles.centered}>
          <Text>No Products Found</Text>
        </View>
      )
    }

    return <FlatList
      onRefresh={loadProducts}
      refreshing={isLoading}
      data={products}
      renderItem={itemData => 
        <ProductItem
           imageUrl={itemData.item.imageUrl}
           title={itemData.item.title}
           price={itemData.item.price}
           onSelect={() => {selectItem(itemData.item.id, itemData.item.title)}}
        >
          <Button color={COlors.primary} title='View Details' onPress={() => {selectItem(itemData.item.id, itemData.item.title)}}/>
          <Button  color={COlors.primary}title='To Cart' onPress={() => {  dispatch(addToCart(itemData.item))}} />
        </ProductItem>
      }
    />
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
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