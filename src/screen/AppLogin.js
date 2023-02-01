/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Divider,
  Input,
  Layout,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {Formik} from 'formik';
import React from 'react';
import {
  Linking,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Tost from 'react-native-toast-message';
import * as Yup from 'yup';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {imgBaseUrl} from '../image.config';
import AppRegister from '../screen/AppRegister';
import {useDispatch} from 'react-redux';

const initSchema = {
  email: (__DEV__ && 'rutvik@gmail.com') || '',
  password: (__DEV__ && 'Admin@123') || '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required('This field is required').min(6).max(18),
});

export default () => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const handleFPass = () => {
    Linking.canOpenURL(`${imgBaseUrl}/forgot-password`).then(canOpen => {
      if (canOpen) {
        Linking.openURL(`${imgBaseUrl}/forgot-password`);
      }
    });
  };

  const handleSubmit = async (val, func) => {
    func.setSubmitting(true);

    await API.apiService
      .post('/api/user/auth/user?login=true', val)
      .then(res => {
        const {
          user: {name, email},
          token,
        } = res.data.data;

        dispatch({type: 'AUTH', email, name, token});
      })
      .then(() => {
        Tost.show({
          type: 'success',
          text1: 'You Have Successfully Logged in',
        });
        navigate('Home');
      })
      .catch(err => {
        console.log('err===', JSON.stringify(err, 0, 6));
      })
      .finally(() => {
        // func.setSubmitting(false);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Layout style={styles.container}>
          <AppHeader title={'Onefoodpot'} />
          <Divider />
          <Layout style={{padding: 15, margin: 15}}>
            <Text
              category="label"
              appearance="default"
              style={{textAlign: 'center', marginBottom: 15, fontSize: 17}}>
              Login
            </Text>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initSchema}
              validationSchema={validationSchema}>
              {({
                handleSubmit,
                handleChange,
                touched,
                errors,
                values,
                isSubmitting,
              }) => {
                return (
                  <>
                    <CustomInput
                      style={styles.inputStyle}
                      label="Email"
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
                      label="Password"
                      value={values?.password}
                      onChangeText={handleChange('password')}
                      isInvalid={!!touched?.password && !!errors?.password}
                      secureTextEntry={true}
                      errorMsg={errors?.password}
                    />
                    <Text
                      style={{...styles.inputStyle, color: '#333'}}
                      appearance="hint"
                      onPress={handleFPass}>
                      Forgot Password?
                    </Text>
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
                      Login
                    </Button>
                  </>
                );
              }}
            </Formik>
          </Layout>
        </Layout>
        <AppRegister />
      </ScrollView>
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
    fontWeight: 'bold',
  },
});

export const CustomInput = props => {
  const {isInvalid, errorMsg} = props;

  return (
    <>
      <Input
        labelStyle={{color: '#000'}}
        {...props}
        status={isInvalid && 'danger'}
      />
      {isInvalid && (
        <Text style={{color: 'red', marginBottom: 10}}>{errorMsg}</Text>
      )}
    </>
  );
};
