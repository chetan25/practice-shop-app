import React, { useEffect, useCallback, useReducer, useState } from 'react';
import {View, ScrollView, StyleSheet, Text, TextInput,Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../store/actions/products';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE ) {
       const updatedValues = {
           ...state.inputValues,
           [action.input]: action.value
        }
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let formIsValid = true;
        for (const key in updatedInputValidities) {
            formIsValid = updatedInputValidities[key] && formIsValid;
        }
        
        return {
           inputValues: updatedValues,
           inputValidities: updatedInputValidities,
           formValid : formIsValid
        }
    }
    
    return state;
}

const EditProductScreen = (props) => {
    const productId = props.navigation.getParam('productId');
    const editProduct = useSelector(state => state.products.userProducts.find(product => product.id === productId));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editProduct ? editProduct.title : '',
            imageUrl: editProduct ? editProduct.imageUrl : '',
            price: editProduct ? editProduct.price : '',
            description: editProduct ? editProduct.description : ''
        },
        inputValidities: {
            title: editProduct ? true : false,
            imageUrl: editProduct ? true : false,
            price: editProduct ? true : false,
            description: editProduct ? true : false
        },
        formValid: editProduct ? true : false
    });

    const dispatch = useDispatch();

    const formInputChangeHandler = (text, input) => {
        let isValid = false;
        if (text.trim().length > 0) {
            isValid = true;
        }
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: text,
            isValid: isValid,
            input: input
        });
    }

    const submitHandler = useCallback(async () => {
        if (!formState.formValid) {
            Alert.alert('Wrong Input', 'Please Enter All Values', [
                {
                    text: 'Okay'
                }
            ]);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if(editProduct) {
                await dispatch(updateProduct(
                    productId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl
                  ));
              } else {
                  await dispatch(createProduct(
                      formState.inputValues.title,
                      formState.inputValues.description,
                      formState.inputValues.imageUrl,
                      formState.inputValues.price
                  ));
              }
        } catch(err) {
            setError(err.message);
        }
     
        setIsLoading(false);

        props.navigation.goBack();
    }, [productId, formState]);

    useEffect(() => {
        props.navigation.setParams({'submit': submitHandler})
    }, [submitHandler]);


    if (isLoading) {
      return (
          <View style={styles.centered}>
              <ActivityIndicator size='large' color={Colors.primary}/>
          </View>
      )
    }

   return (
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={30} style={{flex: 1}}>
           <ScrollView>
        <View style={styles.form}>
            <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={formState.inputValues.title}
                  onChangeText={text => formInputChangeHandler(text, 'title')}
                  keyboardType='default'
                  autoCapitalize='sentences'
                  autoCorrect
                  returnKeyType='next'
                  onEndEditing={() => console.log('done editings')}
                  onSubmitEditing={() => console.log('submitting')}
                />
            </View>
            <View style={styles.formControl}>
                <Text style={styles.label}>Image Url</Text>
                <TextInput
                  style={styles.input}
                  value={formState.inputValues.imageUrl}
                  onChangeText={text => formInputChangeHandler(text, 'imageUrl')}
                />
            </View>
            {
                !productId ? 
                <View style={styles.formControl}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                      style={styles.input}
                      value={formState.inputValues.price}
                      onChangeText={text => formInputChangeHandler(text, 'price')}
                      keyboardType='decimal-pad'
                    />
                </View> : null
            }
            <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  value={formState.inputValues.description}
                  onChangeText={text => formInputChangeHandler(text, 'description')}
                />
            </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView> 
   );
}

EditProductScreen.navigationOptions = (navData) => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Producr',
        headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title='Save'
                iconName={Platform.OS == 'android' ? 'md-checkmark' : 'ios-checkmark'}
                onPress={submitFn}
            />
        </HeaderButtons>,
    }
}

const styles = StyleSheet.create({
   form: {
       margin: 20,
   }, 
   formControl: {
      width: '100%'
   },
   label: {
      fontFamily: 'open-sans-bold',
      marginVertical: 8
   },
   input: {
       paddingHorizontal: 2,
       paddingVertical: 5,
       borderBottomColor: '#ccc',
       borderBottomWidth: 1
   },
   action: {
   },
   centered: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center'
   }
});

export default EditProductScreen;