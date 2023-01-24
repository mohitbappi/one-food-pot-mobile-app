import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {API} from '../axios.config';
import AppChangePassword from '../screen/AppChangePassword';
import AppForgotPassword from '../screen/AppForgotPassword';
import AppHome from '../screen/AppHome';
import AppLogin from '../screen/AppLogin';
import AppMyOrder from '../screen/AppMyOrder';
import AppOrder from '../screen/AppOrder';
import AppProfile from '../screen/AppProfile';
import AppRegister from '../screen/AppRegister';
import AppWhyOrder from '../screen/AppWhyOrder';
import {OrderStatus} from '../screen/OrderStatus';
import {PaymentStatus} from '../screen/PaymentStatus';
import PaypalPayment from '../screen/PaypalPayment';
import {YelpReview} from '../screen/YelpReview';

const {Navigator, Screen} = createNativeStackNavigator();

export const Routes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const initialState = useSelector(state => state.reducer);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const value = await AsyncStorage.getItem('__state');

        if (value !== null) {
          dispatch({type: 'defaultState', state: JSON.parse(value)});
        } else {
          await AsyncStorage.setItem('__state', JSON.stringify(initialState));
          dispatch({type: 'defaultState', state: initialState});
        }
      } catch {
        dispatch({type: 'defaultState', state: initialState});
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('__state', JSON.stringify(initialState));
    })();
  }, [initialState]);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = initialState?.token;
    API.initService();
  }, [initialState]);

  if (isLoading) {
    return (
      <ActivityIndicator
        color="#e88f2a"
        style={{
          flex: 1,
          backgroundColor: '#faf3eb',
        }}
      />
    );
  }

  return (
    <Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Screen name="Home" component={AppHome} />
      <Screen name="Order" component={AppOrder} />
      <Screen name="Login" component={AppLogin} />
      <Screen name="Register" component={AppRegister} />
      <Screen name="ForgotPass" component={AppForgotPassword} />
      <Screen name="Profile" component={AppProfile} />
      <Screen name="MyOrder" component={AppMyOrder} />
      <Screen name="WhyOrder" component={AppWhyOrder} />
      <Screen name="ChangePassword" component={AppChangePassword} />
      <Screen name="PaypalPayment" component={PaypalPayment} />
      <Screen name="YelpReview" component={YelpReview} />
      <Screen name="PaymentStatus" component={PaymentStatus} />
      <Screen name="OrderStatus" component={OrderStatus} />
    </Navigator>
  );
};
