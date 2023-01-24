/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {Button, Divider, Input, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';

export default () => {
  const [locationList, setLocationList] = useState([
    {text: 'Option 1'},
    {text: 'Option 2'},
    {text: 'Option 3'},
  ]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={styles.container}>
        <AppHeader title={'Onefood'} />
        <Divider />
        <Layout style={{padding: 15, margin: 15}}>
          <Text
            category="label"
            appearance="default"
            style={{textAlign: 'center', marginBottom: 15, fontSize: 17}}>
            Forgot Password
          </Text>

          <Input style={styles.inputStyle} placeholder="Email Address" />

          <Button style={styles.inputStyle}>Reset</Button>
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
