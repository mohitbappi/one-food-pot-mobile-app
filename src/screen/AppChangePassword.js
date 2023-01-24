/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
import {Button, Divider, Layout, Spinner} from '@ui-kitten/components';
import {Formik} from 'formik';
import React from 'react';
import {View, SafeAreaView} from 'react-native';
import Tost from 'react-native-toast-message';
import * as Yup from 'yup';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';
import {CustomInput} from './AppLogin';

const changePassValidation = Yup.object().shape({
  oPass: Yup.string().required().min(6).max(18),
  nPass: Yup.string().required().min(6).max(18),
  cNPass: Yup.string()
    .oneOf([Yup.ref('nPass'), null])
    .required(),
});

const initSchema = {
  oPass: '',
  nPass: '',
  cNPass: '',
};

const AppChangePassword = () => {
  const handleSubmit = async (val, func) => {
    func.setSubmitting(true);

    await API.apiService.post(`/api/user/change-password`, val).then(res => {
      Tost.show({
        type: 'success',
        text1: 'Password updated successfully',
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
            initialValues={initSchema}
            validationSchema={changePassValidation}
            onSubmit={handleSubmit}>
            {({
              handleChange,
              handleSubmit,
              touched,
              errors,
              values,
              isSubmitting,
            }) => {
              return (
                <>
                  <CustomInput
                    label="Old password"
                    labelStyle={{color: '#000'}}
                    style={{marginBottom: 8}}
                    value={values?.oPass}
                    isInvalid={!!touched?.oPass && !!errors?.oPass}
                    onChangeText={handleChange('oPass')}
                  />
                  <CustomInput
                    label="New password"
                    labelStyle={{color: '#000'}}
                    style={{marginBottom: 8}}
                    value={values?.nPass}
                    isInvalid={!!touched?.nPass && !!errors?.nPass}
                    onChangeText={handleChange('nPass')}
                  />
                  <CustomInput
                    label="Confirm New password"
                    labelStyle={{color: '#000'}}
                    style={{marginBottom: 8}}
                    value={values?.cNPass}
                    isInvalid={!!touched?.cNPass && !!errors?.cNPass}
                    onChangeText={handleChange('cNPass')}
                  />
                  <Button
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
                    Change
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

export default AppChangePassword;
