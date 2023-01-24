/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, Image, SafeAreaView, StyleSheet, BackHandler} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  imageContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
  webView: {
    flex: 1,
    marginVertical: 40,
    backgroundColor: 'white',
  },
});

const PaypalPayment = () => {
  const {params} = useRoute();
  const {navigate, goBack} = useNavigation();

  useEffect(() => {
    const backAction = () => {
      goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const onNavigationStateChange = navState => {
    const {url} = navState;
    if (url?.includes('/success')) {
      let paymentId = getParameterFromUrl(url, 'paymentId');
      // let token = getParameterFromUrl(url, "token");
      // let PayerID = getParameterFromUrl(url, "PayerID");
      navigate('PaymentStatus', {
        ...params?.paymentData,
        isSuccess: true,
        paymentId: paymentId,
      });
    } else if (url?.includes('/canceled')) {
      navigate('PaymentStatus', {
        ...params?.paymentData,
        isSuccess: false,
      });
    } else if (url?.includes('/cancle')) {
      navigate('PaymentStatus', {
        ...params?.paymentData,
        isSuccess: false,
      });
    }
  };

  const getParameterFromUrl = (url, parm) => {
    var re = new RegExp('.*[?&]' + parm + '=([^&]+)(&|$)');
    var match = url.match(re);
    return match ? match[1] : '';
  };

  const Loading = () => {
    return (
      <SafeAreaView>
        <View style={styles.imageContainer}>
          <Image source={require('./paypal.png')} style={styles.image} />
        </View>
      </SafeAreaView>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <WebView
        style={styles.webView}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        onNavigationStateChange={onNavigationStateChange}
        renderLoading={() => {
          Loading();
        }}
        source={{uri: params?.uri}}
      />
    </SafeAreaView>
  );
};

export default PaypalPayment;
