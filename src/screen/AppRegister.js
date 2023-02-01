/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Button,
  Divider,
  Layout,
  Select,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView, Pressable, Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';
import 'yup-phone-lite';
import {API} from '../axios.config.js';
import {ChatBot} from '../component/ChatBot.js';
import { getFormattedMobile } from '../utils/formatted-mobile.js';
import {CustomInput} from './AppLogin';

const initSchema = {
  name: (__DEV__ && 'Rutvik') || '',
  email: (__DEV__ && 'rutvik@gmail.com') || '',
  mobile: (__DEV__ && '6135550102') || '',
  password: (__DEV__ && 'Admin@123') || '',
  confirmPassword: (__DEV__ && 'Admin@123') || '',
  delivery: '',
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('This field is required').min(2).max(24),
  email: Yup.string().required().email(),
  mobile: Yup.string().phone('CA').required(),
  password: Yup.string().required('This field is required').min(6).max(18),
  confirmPassword: Yup.string()
    .required('This field is required')
    .min(6)
    .max(18)
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

export default () => {
  const [locationArr, setLocationArr] = useState([]);
  const [tempLocation, setTempLocation] = useState('');

  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const isF = useIsFocused();

  useEffect(() => {
    (async () => {
      await Promise.all([
        API.apiService.get('/api/public/location').then(res => {
          setLocationArr(
            res?.data?.data.map(x => ({
              ...x,
              text: `${x?.name} - ${x?.time}`,
            })),
          );
          setTempLocation(res?.data?.data?.[0]);
        }),
      ]);
    })();
  }, [isF]);

  const handleSubmit = async (val, func) => {
    const newVal = {...val};
    newVal.delivery = tempLocation?._id;

    func.setSubmitting(true);
    await API.apiService
      .post('/api/user/auth/user?reqister=true', newVal)
      .then(res => {
        const {
          user: {name, email},
          token,
        } = res?.data?.data;

        dispatch({type: 'AUTH', email, name, token});
      })
      .then(() => {
        navigate('Home');
      })
      .catch(err => {})
      .finally(() => {
        func?.setSubmitting(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={styles.container}>
        <Divider />
        <Layout style={{padding: 15, margin: 15}}>
          <Text
            category="label"
            appearance="default"
            style={{textAlign: 'center', marginBottom: 15, fontSize: 17}}>
            Register
          </Text>

          <Formik
            initialValues={initSchema}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({
              handleSubmit,
              handleChange,
              errors,
              touched,
              values,
              setFieldValue,
              isSubmitting,
            }) => {
              console.log({errors});
              return (
                <>
                  <CustomInput
                    style={styles.inputStyle}
                    label="Name"
                    value={values?.name}
                    onChangeText={handleChange('name')}
                    isInvalid={!!touched?.name && !!errors?.name}
                    errorMsg={errors?.name}
                  />
                  <CustomInput
                    style={styles.inputStyle}
                    label="Email Address"
                    value={values?.email}
                    onChangeText={handleChange('email')}
                    isInvalid={!!touched?.email && !!errors?.email}
                    errorMsg={
                      errors?.email === 'email must be a valid email'
                        ? 'Invalid Email'
                        : 'This field is required'
                    }
                  />
                  <CustomInput
                    style={styles.inputStyle}
                    label="Phone"
                    value={getFormattedMobile(values?.mobile)}
                    onChangeText={handleChange('mobile')}
                    isInvalid={!!touched?.mobile && !!errors?.mobile}
                    errorMsg={
                      errors?.mobile ===
                      'mobile must be a valid phone number for region CA'
                        ? 'Invalid Number'
                        : 'This field is required'
                    }
                  />
                  <CustomInput
                    style={styles.inputStyle}
                    label="Password"
                    value={values?.password}
                    secureTextEntry={true}
                    onChangeText={handleChange('password')}
                    isInvalid={!!touched?.password && !!errors?.password}
                    errorMsg={errors?.password}
                  />
                  <CustomInput
                    style={styles.inputStyle}
                    label="Confirm Password"
                    value={values?.confirmPassword}
                    secureTextEntry={true}
                    onChangeText={handleChange('confirmPassword')}
                    isInvalid={
                      !!touched?.confirmPassword && !!errors?.confirmPassword
                    }
                    errorMsg={errors?.confirmPassword}
                  />
                  <View style={{alignSelf: 'center'}}>
                    <Text>By registering you are agreed with our </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                      }}>
                      <Pressable
                        onPress={() => {
                          Linking.openURL(
                            'https://1foodpot.com/privacy-policy',
                          );
                        }}>
                        <Text style={{color: '#e88f2a'}}>Privacy Policy</Text>
                      </Pressable>
                      <Text>{' and other Policies'}</Text>
                    </View>
                  </View>
                  <Button
                    style={styles.inputStyle}
                    onPress={handleSubmit}
                    icon={() =>
                      isSubmitting ? (
                        <View>
                          <Spinner status="control" />
                        </View>
                      ) : (
                        <></>
                      )
                    }>
                    Register
                  </Button>
                </>
              );
            }}
          </Formik>
        </Layout>
        <ChatBot />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
    flex: 1,
    backgroundColor: '#faf3eb',
  },
  bgOrange: {
    backgroundColor: '#faf3eb',
  },
  inputStyle: {
    marginBottom: 15,
  },
});
