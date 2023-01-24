/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Icon} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {Text, SafeAreaView, StyleSheet, BackHandler} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf3eb',
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 100,
    marginTop: 50,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 25,
    marginTop: 15,
    color: '#000',
  },
  homeButton: {
    marginTop: 15,
    paddingVertical: 8,
  },
});

const OrderStatus = () => {
  const {params} = useRoute();
  const {navigate} = useNavigation();
  useEffect(() => {
    const backAction = () => {
      navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {(params?.isSuccess && (
        <Icon
          style={styles.icon}
          fill={'#a5dc86'}
          name={'checkmark-circle-outline'}
        />
      )) || (
        <Icon
          style={styles.icon}
          fill={'#ff0000'}
          name={'close-circle-outline'}
        />
      )}
      <Text style={styles.subTitle}>
        {`${
          (params?.isSuccess && 'Your order is successfully placed') ||
          "We can't place your order!"
        }`}
      </Text>
      <Button
        onPress={() => {
          navigate('Home');
        }}
        style={styles.homeButton}>
        {`${(params?.isSuccess && 'Ok') || 'Back To Home'}`}
      </Button>
    </SafeAreaView>
  );
};

export {OrderStatus};
