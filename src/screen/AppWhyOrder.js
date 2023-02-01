/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Layout} from '@ui-kitten/components';
import React from 'react';
import AppHeader from '../component/AppHeader';
import {ModalContent} from './AppHome';
import {ChatBot} from '../component/ChatBot';

const AppWhyOrder = () => {
  return (
    <SafeAreaView style={{height: '100%'}}>
      <Layout style={styles.container}>
        <AppHeader title={'Onefoodpot'} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ModalContent />
        </ScrollView>
        <ChatBot />
      </Layout>
    </SafeAreaView>
  );
};

export default AppWhyOrder;

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
    flex: 1,
    backgroundColor: '#faf3eb',
  },
  styledText: {
    color: '#e88f2a',
    fontSize: 18,
    marginBottom: 8,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 256,
    padding: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
