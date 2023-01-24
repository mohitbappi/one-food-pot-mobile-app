/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
import {useIsFocused} from '@react-navigation/native';
import {Divider, Layout, Text} from '@ui-kitten/components';
import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, SafeAreaView, View} from 'react-native';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';
import {imgBaseUrl} from '../image.config';

const AppMyOrder = () => {
  const [itemArr, setItemArr] = useState([]);
  const isF = useIsFocused();

  useEffect(() => {
    (async () => {
      await API.apiService
        .get('/api/user/orders')
        .then(res => {
          setItemArr(res?.data?.data);
        })
        .catch(err => {});
    })();
  }, [isF]);

  const renderListEmptyComponent = () => {
    return <Text style={styles.text}>No orders placed</Text>;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={styles.container}>
        <AppHeader title={'My Orders'} />
        <Divider />
        {Array.isArray(itemArr) && (
          <FlatList
            data={itemArr}
            renderItem={RenderItems}
            keyExtractor={item => item?._id}
            ListEmptyComponent={renderListEmptyComponent}
          />
        )}
        <ChatBot />
      </Layout>
    </SafeAreaView>
  );
};

const RenderItems = ({item}) => {
  return (
    <>
      <Layout
        style={{
          ...styles.container,
          paddingVertical: 10,
          backgroundColor: '#faf3eb',
        }}>
        <View
          style={{
            borderBottomWidth: 1,
            padding: 20,
            margin: 20,
            borderColor: '#c7c7cc',
          }}>
          <Image
            style={{width: '100%', height: 250, marginBottom: 8}}
            resizeMode={'center'}
            source={{uri: `${imgBaseUrl}/api/file/${item?.product?.img}`}}
          />
          <Text
            category="label"
            style={{fontSize: 18, textTransform: 'capitalize'}}>
            {item?.product?.name}
          </Text>
          <Text style={{textAlignVertical: 'center'}}>
            <Text style={{fontSize: 18}}>{item?.qty} Items </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              {'•'}
            </Text>
            <Text style={{fontSize: 18}}> ${item?.totalPrice}</Text>
          </Text>
          <Text>
            <Text style={{fontSize: 18}}>{'Payment Type '}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{'•'}</Text>
            <Text
              style={{
                fontSize: 18,
                color:
                  (item.isPaid && '#a5dc86') ||
                  (item.isOfline && '#e88f2a') ||
                  '#ff0000',
              }}>{` ${
              (item.isPaid && 'Paid') || (item.isOfline && 'Pending') || 'Fail'
            }`}</Text>
          </Text>
          <Text>
            <Text style={{fontSize: 18}}>{'Payment Status '}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{'•'}</Text>
            <Text style={{fontSize: 18}}>{` ${
              (item?.isPaid && 'Completed') || 'Failed'
            }`}</Text>
          </Text>
          <Text>
            <Text style={{fontSize: 18}}>{'Delivery location '}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{'•'}</Text>
            <Text
              style={{
                fontSize: 18,
                textTransform: 'capitalize',
              }}>{` ${item?.address?.name}`}</Text>
          </Text>
          <Text>
            <Text style={{fontSize: 18}}>{`${moment(item?.createdAt)
              .tz('America/New_York')
              .format('dddd, MMMM Do YYYY, h:mm a')} `}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{'•'}</Text>
            <Text style={{fontSize: 18}}>{` ${
              !(item.isPaid === false && item.isOfline === false)
                ? item.isDeliverd
                  ? 'Delivered'
                  : 'Delivery pending'
                : 'Delivery cancelled'
            }`}</Text>
          </Text>
        </View>
      </Layout>
    </>
  );
};

export default AppMyOrder;

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    marginTop: 350,
    fontWeight: 'bold',
    fontSize: 16,
  },
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
