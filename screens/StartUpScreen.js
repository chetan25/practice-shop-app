import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { useDispatch } from 'react-redux';
import { authenticate, USER_DATA_ACCESSOR} from '../store/actions/auth';

const StartupScreen = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
           const userData = await AsyncStorage.getItem(USER_DATA_ACCESSOR);
           if (!userData) {
               props.navigation.navigate('Authenticate');
               return;
           }
           const transformedData = JSON.parse(userData);
           const { token, userId, expiryDate, expiresIn } = transformedData;
           const expirationDate = new Date(expiryDate);
           if (expirationDate <= new Date() || !token || !userId) {
              props.navigation.navigate('Authenticate');
              return;
           }
           await dispatch(authenticate(userId, token, expiresIn))
           props.navigation.navigate('Shop');
        };

        tryLogin();
    }, [dispatch]);
    
    return <View style={styles.screen}>
        <ActivityIndicator size='large' color={Colors.primary} />
    </View>;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;