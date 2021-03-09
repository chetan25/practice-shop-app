import React, { useReducer, useCallback, useState, useEffect } from 'react';
import { Alert, View, KeyboardAvoidingView, ScrollView, StyleSheet, Button, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { signUp, login } from '../../store/actions/auth';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
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

const AuthScreen = props => {
    const dispatch = useDispatch();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false
        },
        formValid: false
    });

    useEffect(() => {
       if (error) {
           Alert.alert('An Error Occured', error, [{
               text: 'Okay'
           }]);
       }
    }, [error]);

    const authHandler = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                await dispatch(signUp(formState.inputValues.email, formState.inputValues.password));
            } else {
                await dispatch(login(formState.inputValues.email, formState.inputValues.password));
            }
            props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message);
           setIsLoading(false);
        }
    };

    const formInputChangeHandler = useCallback((textIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: textIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='email'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorText='Please enter valid email'
                            onInputChange={formInputChangeHandler}
                            initialValue=''
                        />
                        <Input
                            id='password'
                            label='password'
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize='none'
                            errorText='Please enter valid password'
                            onInputChange={formInputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            {
                                isLoading ? <ActivityIndicator size='small' color={Colors.primary}/> :
                                <Button title={isSignUp ? 'Sign-Up' : 'Login'} color={Colors.primary} onPress={authHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                          <Button  title={`Switch to ${isSignUp ? 'Login' : 'Sign-Up'}`} color={Colors.accent} onPress={() => {
                              setIsSignUp(prevState => !prevState)
                          }} />
                        </View>  
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
 };

 AuthScreen.navigationOptions = {
   headerTitile: 'Please Authenticate'
 }

 const styles = StyleSheet.create({
    gradient: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center'
    }, 
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 500,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10,
    }
 });

 export default AuthScreen;