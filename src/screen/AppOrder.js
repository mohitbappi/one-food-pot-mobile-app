/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {useGooglePay, useStripe} from '@stripe/stripe-react-native';
import {CheckBox, Divider, Icon, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  Pressable,
  Alert,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import Tost, {ErrorToast} from 'react-native-toast-message';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useSelector} from 'react-redux';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';
import {
  MakeCodOrder,
  PaymentViaGooglePay,
  paymentViaPaypal,
  paymentViaStripeMobile,
  verifyPayment,
} from '../Services/PaymentServices';

const AppOrder = () => {
  const [jsonData, setJsonData] = useState({
    name: '',
    qty: '1',
    cpp: '',
    ppTp: '',
    tax: '',
    tip: '',
    isTip: true,
    tp: '',
  });

  const {params} = useRoute();
  const isF = useIsFocused();
  const state = useSelector(initialState => initialState.reducer);
  const {navigate} = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const {isGooglePaySupported, initGooglePay, presentGooglePay} =
    useGooglePay();

  const [recipeInfo, setRecipeInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  let verificationCode = '';
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQnty, setRemainingQnty] = useState(0);

  useEffect(() => {
    if (params) {
      (async () => {
        const {locationId, name} = params;

        let userInfo = {};
        let recipe = {};
        let allLocations = [];

        await Promise.all([
          API.apiService.get('/api/user/information').then(res => {
            userInfo = res?.data?.data;
          }),
          API.apiService.get('/api/recipe').then(res => {
            recipe = res?.data?.data;
          }),
          API.apiService.get('/api/public/location').then(res => {
            allLocations = res?.data?.data;
          }),
        ]);

        setRecipeInfo(recipe);
        setRemainingQnty(recipe?.remainingQuantity);
        setUserInfo(userInfo);

        setJsonData(x => ({
          ...x,
          name: recipe?.name,
          tax:
            parseFloat(
              (parseFloat(recipe?.tax) * parseFloat(recipe?.discountPrice)) /
                100,
            )
              ?.toFixed(2)
              .toString() || '',
          tip: parseFloat(recipe?.tip)?.toFixed(2).toString() || '',
          qty: 1,
          cpp: parseFloat(recipe?.discountPrice)?.toFixed(2).toString() || '',
          ppTp: parseFloat(recipe?.discountPrice)?.toFixed(2).toString() || '',
          isTip: true,
          tp:
            (
              parseFloat(recipe?.discountPrice) +
              parseFloat(
                (parseFloat(recipe?.tax) * parseFloat(recipe?.discountPrice)) /
                  100,
              ) +
              parseFloat(recipe?.tip)
            ).toString() || '',
        }));
      })();
    }
  }, [params, isF]);

  const toastConfig = {
    error: props => <ErrorToast {...props} text1NumberOfLines={2} />,
  };

  useEffect(() => {
    if (remainingQnty === 1) {
      Toast.show({
        type: 'error',
        text1: `We have only ${recipeInfo?.remainingQuantity} order remaining. You have reached to maximum limit!!!`,
        text1NumberOfLines: 2,
      });
    }
  }, [remainingQnty]);

  useEffect(() => {
    let actualQty = parseInt(jsonData?.qty);

    let tax = parseFloat(
      (parseFloat(recipeInfo?.tax) * parseFloat(recipeInfo?.discountPrice)) /
        100,
    );

    if (jsonData?.isTip) {
      const ap =
        parseFloat(recipeInfo?.discountPrice) * parseInt(jsonData?.qty) +
        parseFloat(tax) * parseInt(jsonData?.qty) +
        parseFloat(recipeInfo?.tip);

      setJsonData(x => ({
        ...x,
        tax:
          parseFloat(tax * jsonData?.qty)
            ?.toFixed(2)
            .toString() || '',
        tp: ap,
        ppTp:
          parseFloat(recipeInfo?.discountPrice * jsonData?.qty)
            ?.toFixed(2)
            .toString() || '',
      }));
    } else {
      const ap =
        parseFloat(recipeInfo?.discountPrice) * parseInt(jsonData?.qty) +
        parseFloat(tax) * parseInt(jsonData?.qty);

      setJsonData(x => ({
        ...x,
        tax:
          parseFloat(tax * jsonData?.qty)
            ?.toFixed(2)
            .toString() || '',
        tp: ap,
        ppTp:
          parseFloat(recipeInfo?.discountPrice * jsonData?.qty)
            ?.toFixed(2)
            .toString() || '',
      }));
    }
  }, [jsonData?.qty, jsonData?.isTip, isF]);

  const handleQtyInc = () => {
    setJsonData(x => ({
      ...x,
      qty: (parseInt(x?.qty) + 1).toString() || '',
    }));
    setRemainingQnty(qnty => qnty - 1);
  };

  const handleQtyDec = () => {
    if (jsonData?.qty > 1) {
      setJsonData(x => ({
        ...x,
        qty: (parseInt(x?.qty) - 1).toString() || '',
      }));
      setRemainingQnty(qnty => qnty + 1);
    }
  };

  const handleUp = () => {
    setJsonData(x => ({...x, isTip: true}));
  };

  const handleDown = () => {
    setJsonData(x => ({...x, isTip: false}));
  };

  const createPaypalOrder = async () => {
    try {
      setIsProcessing(true);
      const apiParams = {
        withTipIncludes: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
        address: params?.locationId,
        qty: jsonData?.qty?.toString(),
        isTip: jsonData?.isTip,
      };
      const response = await paymentViaPaypal(apiParams, state?.token);
      if (response?.msg === 'payment created successfully') {
        setIsProcessing(false);
        navigate('PaypalPayment', {
          uri: response?.data?.uri,
          paymentData: {
            name: userInfo?.name,
            nameOfFood: recipeInfo?.name,
            qty: jsonData?.qty?.toString(),
            payAmount: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
          },
        });
      }
    } catch (error) {
      console.log('here', error.response.data);
      setIsProcessing(false);
    }
  };

  const createStripeMobileOrder = async () => {
    try {
      setIsProcessing(true);
      const data = {
        qty: Number(jsonData?.qty),
        isTip: jsonData?.isTip,
        location: params?.locationId,
      };
      const response = await paymentViaStripeMobile(data, state?.token);
      if (response.success) {
        verificationCode = response?.data?.verificationCode;
        const {error} = await initPaymentSheet({
          customerId: response?.data?.customer,
          customerEphemeralKeySecret: response?.data?.ephemeralKey,
          paymentIntentClientSecret: response?.data?.paymentIntent,
          allowsDelayedPaymentMethods: true,
          applePay: true,
          merchantCountryCode: 'US',
          merchantDisplayName: 'One Food',
        });
        if (!error) {
          setIsProcessing(true);
          openPaymentSheet();
        } else {
          console.log('heerajhja', error);
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.log(error?.response);
      setIsProcessing(false);
    }
  };

  const openPaymentSheet = async () => {
    try {
      setIsProcessing(true);
      const {error} = await presentPaymentSheet();
      if (!error) {
        const response = await verifyPayment(verificationCode, state?.token);
        if (response?.success) {
          setIsProcessing(false);
          navigate('PaymentStatus', {
            name: userInfo?.name,
            nameOfFood: recipeInfo?.name,
            qty: jsonData?.qty?.toString(),
            payAmount: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
            isSuccess: true,
            paymentId: verificationCode,
          });
        }
      } else {
        if (error.code !== 'Canceled') {
          Tost.show({
            type: 'error',
            text1: 'something went wrong please try again',
          });
        }
        setIsProcessing(false);
        console.log(error);
      }
    } catch (error) {
      console.log(error?.response?.status);
      console.log(error?.response?.data);
      setIsProcessing(false);
      if (error?.response?.status === 400) {
        navigate('PaymentStatus', {
          name: userInfo?.name,
          nameOfFood: recipeInfo?.name,
          qty: jsonData?.qty?.toString(),
          payAmount: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
          isSuccess: false,
        });
      }
    }
  };

  const presentGooglePaySheet = async () => {
    try {
      setIsProcessing(true);
      if (!(await isGooglePaySupported({testEnv: true}))) {
        setIsProcessing(false);
        Alert.alert('Google Pay is not supported.');
        return;
      }
      const {error} = await initGooglePay({
        testEnv: false,
        merchantName: 'One Food',
        countryCode: 'US',
        billingAddressConfig: {
          format: 'FULL',
          isPhoneNumberRequired: true,
          isRequired: false,
        },
        existingPaymentMethodRequired: false,
        isEmailRequired: true,
      });

      if (error) {
        // Alert.alert(error.code, error.message);

        Tost.show({
          type: 'error',
          text1: 'something went wrong please try again',
        });
        setIsProcessing(false);
        return;
      }

      const paymentParams = {
        qty: jsonData?.qty?.toString(),
        isTip: jsonData?.isTip,
        location: params?.locationId,
      };

      const response = await PaymentViaGooglePay(paymentParams, state?.token);
      if (response.success) {
        verificationCode = response?.data?.verificationCode;
        const errorGoogle = await presentGooglePay({
          clientSecret: response?.data?.client_secret,
          forSetupIntent: false,
        }).error;

        if (errorGoogle) {
          // Alert.alert(error.code, error.message);
          console.log(errorGoogle);
          if (errorGoogle.code !== 'Canceled') {
            Tost.show({
              type: 'error',
              text1: 'something went wrong please try again',
            });
          }
          setIsProcessing(false);
          return;
        } else {
          const response = await verifyPayment(verificationCode, state?.token);
          if (response?.success) {
            setIsProcessing(false);
            navigate('PaymentStatus', {
              name: userInfo?.name,
              nameOfFood: recipeInfo?.name,
              qty: jsonData?.qty?.toString(),
              payAmount: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
              isSuccess: true,
              paymentId: verificationCode,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      Tost.show({
        type: 'error',
        text1: 'something went wrong please try again',
      });
      setIsProcessing(false);
      console.log(error?.response?.data);
      if (error.response.status === 400) {
        navigate('PaymentStatus', {
          name: userInfo?.name,
          nameOfFood: recipeInfo?.name,
          qty: jsonData?.qty?.toString(),
          payAmount: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
          isSuccess: false,
        });
      }
    }
  };

  const ConfirmCashOnDelivery = async () => {
    try {
      setIsLoading(true);
      setIsProcessing(true);
      const paramsData = {
        withTipIncludes: parseFloat(jsonData?.tp)?.toFixed(2)?.toString(),
        address: params?.locationId,
        qty: Number(jsonData?.qty),
        isTip: jsonData?.isTip,
      };
      const response = await MakeCodOrder(paramsData, state?.token);
      if (response.success) {
        setIsLoading(false);
        setIsProcessing(false);
        setShowModal(false);
        navigate('OrderStatus', {
          isSuccess: true,
        });
      } else {
        setIsLoading(false);
        setIsProcessing(false);
        setShowModal(false);
        navigate('OrderStatus', {
          isSuccess: false,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isProcessing) {
      const backAction = () => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isProcessing]);

  return (
    <SafeAreaView style={{flex: 1, flexGrow: 1}}>
      <Layout style={styles.container}>
        <AppHeader title={'Order Confirmation'} />
        <Divider />
        <ScrollView style={{height: '100%'}}>
          <Layout style={{padding: 15, margin: 15}}>
            <Text category="h6" style={styles.styledText} appearance="default">
              Order Confirmation Details
            </Text>
            <Text style={{fontSize: 15}} category="label">
              Name:{' '}
              <Text style={{color: '#333', textTransform: 'capitalize'}}>
                {userInfo?.name}
              </Text>
            </Text>
            <Text style={{fontSize: 15}} category="label">
              Email: <Text style={{color: '#333'}}>{userInfo?.email}</Text>
            </Text>
            <Text style={{fontSize: 15}} category="label">
              Phone No: <Text style={{color: '#333'}}>{userInfo?.mobile}</Text>
            </Text>
            <Text
              style={{fontSize: 15, textTransform: 'capitalize'}}
              category="label">
              Delivery Location:{' '}
              <Text style={{color: '#333'}}>{params?.name}</Text>{' '}
            </Text>
            <Divider
              style={{marginTop: 10, marginBottom: 10, borderColor: 'black'}}
            />
            <View style={styles.tableRowContainer}>
              <View style={styles.tableCell}>
                <Text style={{color: '#000'}}>{'Name Of Food'}</Text>
              </View>
              <View style={[styles.tableCell, styles.leftBorder]}>
                <Text style={{color: '#333', textTransform: 'capitalize'}}>
                  {recipeInfo?.name}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{'Quantity'}</Text>
              </View>
              <View
                style={[styles.tableCell, styles.leftBorder, styles.topBorder]}>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    onPress={handleQtyDec}
                    style={{
                      backgroundColor: '#e88f2a',
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                      borderRightWidth: 1,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderRightColor: '#636363',
                    }}>
                    <Icon
                      name="arrow-left-outline"
                      fill={'#ffffff'}
                      style={{height: 25, width: 25}}
                    />
                  </Pressable>
                  <View
                    style={{
                      backgroundColor: '#e88f2a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                    }}>
                    <Text style={{color: '#fff'}}>
                      {jsonData?.qty?.toString() || ''}
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleQtyInc}
                    disabled={remainingQnty === 1}
                    style={{
                      backgroundColor: '#e88f2a',
                      borderLeftColor: '#636363',
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                      borderLeftWidth: 1,
                      opacity: remainingQnty === 1 ? 0.6 : 1,
                    }}>
                    <Icon
                      name="arrow-right-outline"
                      fill={'#ffffff'}
                      style={{height: 25, width: 25}}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{'Cost per plate ($)'}</Text>
              </View>
              <View
                style={[styles.tableCell, styles.leftBorder, styles.topBorder]}>
                <Text style={{color: '#333'}}>
                  {(!isNaN(jsonData?.cpp) && jsonData?.cpp) || '-'}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{`Tax (${
                  recipeInfo?.tax || ''
                }%)`}</Text>
              </View>
              <View
                style={[styles.tableCell, styles.leftBorder, styles.topBorder]}>
                <Text style={{color: '#333'}}>
                  {(!isNaN(jsonData?.tax) && jsonData?.tax) || '-'}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{`Tip (${
                  jsonData?.tip || ''
                }$)`}</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  styles.leftBorder,
                  styles.topBorder,
                  {flexDirection: 'row', justifyContent: 'flex-start'},
                ]}>
                <CheckBox
                  text={'Yes'}
                  checked={jsonData?.isTip}
                  onChange={handleUp}
                  textStyle={{color: '#333'}}
                />
                <CheckBox
                  text={'No'}
                  checked={!jsonData?.isTip}
                  onChange={handleDown}
                  textStyle={{color: '#333'}}
                />
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{'Total Price ($)'}</Text>
              </View>
              <View
                style={[styles.tableCell, styles.leftBorder, styles.topBorder]}>
                <Text style={{color: '#333'}}>
                  {(!isNaN(parseFloat(jsonData?.tp)?.toFixed(2).toString()) &&
                    parseFloat(jsonData?.tp)?.toFixed(2).toString()) ||
                    '-'}
                </Text>
              </View>
            </View>
            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCell, styles.topBorder]}>
                <Text style={{color: '#000'}}>{'Payment Options'}</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  styles.leftBorder,
                  styles.topBorder,
                  {paddingRight: '4%'},
                ]}>
                {/* Todo:- Will use it later. */}
                {/* <Pressable
                  style={{
                    backgroundColor: '#e88f2a',
                    marginLeft: 4,
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderRadius: 5,
                    marginBottom: 10,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => {
                    if (isProcessing) {
                      Tost.show({
                        type: 'error',
                        text1: 'Other Payment is processing',
                      });
                    } else {
                      createPaypalOrder();
                    }
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    PayPal
                  </Text>
                </Pressable> */}
                {/* Todo:- Will use it later. */}
                {/* <Pressable
                  style={{
                    backgroundColor: '#e88f2a',
                    marginLeft: 4,
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderRadius: 5,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                  }}
                  onPress={() => {
                    if (isProcessing) {
                      Tost.show({
                        type: 'error',
                        text1: 'Other Payment is processing',
                      });
                    } else {
                      createStripeMobileOrder();
                    }
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {`${
                      (Platform.OS === 'ios' && 'Card or Apple Wallet') ||
                      'Card'
                    }`}
                  </Text>
                </Pressable> */}
                <Pressable
                  style={{
                    backgroundColor: '#e88f2a',
                    marginLeft: 4,
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderRadius: 5,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                  }}
                  onPress={() => {
                    if (isProcessing) {
                      Tost.show({
                        type: 'error',
                        text1: 'Other Payment is processing',
                      });
                      setShowModal(false);
                    } else {
                      setIsProcessing(true);
                      setShowModal(true);
                    }
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    Pay On Delivery
                  </Text>
                </Pressable>
                {/* Todo:- Will use it later. */}
                {/* {(Platform.OS !== 'ios' && (
                  <Pressable
                    onPress={() => {
                      if (isProcessing) {
                        Tost.show({
                          type: 'error',
                          text1: 'Other Payment is processing',
                        });
                      } else {
                        presentGooglePaySheet();
                      }
                    }}>
                    <Image
                      source={require('../../assets/google_pay_button.png')}
                      style={{
                        width: Dimensions.get('window').width / 2.7,
                        height: 40,
                      }}
                    />
                  </Pressable>
                )) ||
                  null} */}
              </View>
            </View>
          </Layout>
        </ScrollView>
        <ChatBot />
      </Layout>
      <Modal
        visible={showModal}
        transparent={true}
        backdropColor={'black'}
        hasBackdrop
        backdropOpacity={0.7}
        onBackButtonPress={() => {
          if (!isLoading) {
            setIsProcessing(false);
            setShowModal(false);
          }
        }}>
        <View style={styles.modalContainer}>
          <Icon
            style={styles.icon}
            fill={'#e88f2a'}
            name={'alert-circle-outline'}
          />
          <Text style={styles.confirmTextStyle}>{'Confirm order?'}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                if (!isLoading) {
                  setIsProcessing(false);
                  setShowModal(false);
                  setIsLoading(false);
                }
              }}>
              <Text style={{color: '#333'}}>{'Cancel'}</Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={() => {
                ConfirmCashOnDelivery();
              }}>
              {(isLoading && (
                <ActivityIndicator size={'small'} color={'white'} />
              )) || <Text style={{color: 'white'}}>{'Confirm'}</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>
      {(isProcessing && (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={'#e88f2a'} />
        </View>
      )) ||
        null}
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default AppOrder;

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
  head: {height: 40},
  text: {margin: 6},
  tableRowContainer: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '50%',
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
  },
  leftBorder: {
    borderLeftWidth: 0,
  },
  topBorder: {
    borderTopWidth: 0,
  },
  icon: {
    height: 100,
    width: 100,
    marginTop: 20,
  },
  modalContainer: {
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#faf3eb',
    alignSelf: 'center',
    borderRadius: 8,
  },
  confirmTextStyle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: '#e7e7e7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 1,
    borderWidth: 1,
    borderColor: '#dadada',
  },
  confirmButton: {
    backgroundColor: '#e88f2a',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 1,
    marginLeft: 15,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,9,9,0.73)',
  },
});
