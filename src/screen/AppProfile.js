/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Button,
  ButtonGroup,
  Divider,
  Layout,
  Select,
  Spinner,
} from '@ui-kitten/components';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import Tost from 'react-native-toast-message';
import * as Yup from 'yup';
import 'yup-phone-lite';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';
import {CustomInput} from './AppLogin';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(4).max(24),
  email: Yup.string().required().email(),
  mobile: Yup.string().phone('CA').required(),
});

const AppProfile = () => {
  const [defaultState, setDefaultState] = useState({
    name: '',
    email: '',
    mobile: '',
    delivery: '',
  });

  const {navigate} = useNavigation();

  const [locationArr, setLocationArr] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState({text: ''});

  const isF = useIsFocused();

  useEffect(() => {
    (async () => {
      const [location, user] = await Promise.all([
        API.apiService.get('/api/public/location'),
        API.apiService.get('/api/user/auth/user'),
      ]);

      const locationArr = location?.data?.data;
      const userInfo = user?.data?.data;

      setDefaultState({
        name: userInfo?.name,
        email: userInfo?.email,
        mobile: userInfo?.mobile,
        delivery: userInfo?.delivery?._id,
      });

      let dfLocation = '';

      locationArr.map(x => {
        if (x?._id === userInfo?.delivery?._id) {
          dfLocation = `${x?.name} - ${x?.time}`;
        }
      });

      setLocationArr(
        location?.data?.data?.map(x => ({
          text: `${x?.name} - ${x?.time}`,
          _id: x?._id,
        })),
      );

      setDefaultLocation({text: dfLocation});
    })();
  }, [isF]);

  const handleRedirect = () => {
    navigate('ChangePassword');
  };

  const handleSubmit = async (val, func) => {
    const newVal = {...val};
    newVal.delivery = locationArr?.[0]?._id;
    const {name, mobile, delivery} = newVal;

    func.setSubmitting(true);
    await API.apiService
      .post('/api/user/update', {name, mobile, delivery})
      .then(res => {
        Tost.show({
          type: 'success',
          text1: 'Profile info updated successfully',
        });
      });
    func.setSubmitting(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout
        style={{
          minHeight: 192,
          flex: 1,
          backgroundColor: '#faf3eb',
        }}>
        <AppHeader title={'My Profile'} />
        <Divider />

        <Layout style={{padding: 15, margin: 15}}>
          <Formik
            enableReinitialize
            initialValues={defaultState}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}>
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              touched,
              errors,
              values,
              isSubmitting,
            }) => {
              return (
                <>
                  <CustomInput
                    style={{marginBottom: 8}}
                    label="Name"
                    labelStyle={{color: '#000'}}
                    value={values?.name}
                    isInvalid={!!touched?.name && !!errors?.name}
                    onChangeText={handleChange('name')}
                  />
                  <CustomInput
                    style={{marginBottom: 8}}
                    label="Email"
                    labelStyle={{color: '#000'}}
                    disabled
                    value={values?.email}
                    isInvalid={!!touched?.email && !!errors?.email}
                    onChangeText={handleChange('email')}
                  />
                  <CustomInput
                    style={{marginBottom: 8}}
                    label="Phone No"
                    labelStyle={{color: '#000'}}
                    value={values?.mobile}
                    isInvalid={!!touched?.mobile && !!errors?.mobile}
                    onChangeText={handleChange('mobile')}
                  />
                  {/* Todo:- Will use it later. */}
                  {/* <Select
                    style={{marginBottom: 8}}
                    selectedOption={defaultLocation}
                    label="Delivery Location"
                    labelStyle={{color: '#000'}}
                    data={locationArr}
                    onSelect={val => {
                      const {_id} = val;

                      setFieldValue('delivery', _id);
                      setDefaultLocation(val);
                    }}
                  /> */}
                  <ButtonGroup>
                    <Button
                      style={{margin: 5, marginLeft: 0}}
                      onPress={handleRedirect}>
                      Change Password
                    </Button>
                    <Button
                      style={{margin: 5}}
                      icon={() =>
                        isSubmitting ? (
                          <View>
                            <Spinner status="control" />
                          </View>
                        ) : (
                          <></>
                        )
                      }
                      onPress={handleSubmit}>
                      Update
                    </Button>
                  </ButtonGroup>
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

export default AppProfile;
