/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Icon} from '@ui-kitten/components';

const width = Dimensions.get('window').width;

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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  tableText: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 8,
    marginLeft: 15,
    alignSelf: 'flex-start',
    color: '#333',
  },
  itemsContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    borderWidth: 1,
    width: (width - 40) / 2,
    borderColor: '#cbc2c2',
  },
  itemLeftBorder: {
    borderLeftWidth: 0,
  },
  itemTopBorder: {
    borderTopWidth: 0,
  },
  homeButton: {
    marginTop: 15,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});

const PaymentStatus = () => {
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
      <Text style={styles.title}>{`Hey ${params?.name}`}</Text>
      {(params?.isSuccess && (
        <Text style={styles.subTitle}>{'Your order is confirmed !'}</Text>
      )) ||
        null}
      <View style={styles.itemsContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.tableText}>{'Name'}</Text>
        </View>
        <View style={[styles.itemContainer, styles.itemLeftBorder]}>
          <Text style={[styles.tableText, {textTransform: 'capitalize'}]}>
            {params?.name}
          </Text>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <View style={[styles.itemContainer, styles.itemTopBorder]}>
          <Text style={styles.tableText}>{'Name Of Food'}</Text>
        </View>
        <View
          style={[
            styles.itemContainer,
            styles.itemLeftBorder,
            styles.itemTopBorder,
          ]}>
          <Text style={[styles.tableText, {textTransform: 'capitalize'}]}>
            {params?.nameOfFood}
          </Text>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <View style={[styles.itemContainer, styles.itemTopBorder]}>
          <Text style={styles.tableText}>{'Quantity'}</Text>
        </View>
        <View
          style={[
            styles.itemContainer,
            styles.itemLeftBorder,
            styles.itemTopBorder,
          ]}>
          <Text style={styles.tableText}>{params?.qty}</Text>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <View style={[styles.itemContainer, styles.itemTopBorder]}>
          <Text style={styles.tableText}>{'Pay Amount'}</Text>
        </View>
        <View
          style={[
            styles.itemContainer,
            styles.itemLeftBorder,
            styles.itemTopBorder,
          ]}>
          <Text style={styles.tableText}>{`$${params?.payAmount}`}</Text>
        </View>
      </View>
      {(params?.paymentId && (
        <View style={styles.itemsContainer}>
          <View style={[styles.itemContainer, styles.itemTopBorder]}>
            <Text style={styles.tableText}>{'Payment Id'}</Text>
          </View>
          <View
            style={[
              styles.itemContainer,
              styles.itemLeftBorder,
              styles.itemTopBorder,
            ]}>
            <Text style={styles.tableText}>{params?.paymentId}</Text>
          </View>
        </View>
      )) ||
        null}
      <Button
        onPress={() => {
          navigate('Home');
        }}
        style={styles.homeButton}>
        Back To Home
      </Button>
    </SafeAreaView>
  );
};

export {PaymentStatus};
