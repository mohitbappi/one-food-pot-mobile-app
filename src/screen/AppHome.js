/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Modal,
  Select,
  Text,
} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {API} from '../axios.config';
import AppHeader from '../component/AppHeader';
import {ChatBot} from '../component/ChatBot';
import {imgBaseUrl} from '../image.config';

export const capitalize = str => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

export const RenderWhyShouldOrderView = () => {
  const data = [
    {
      title: 'Avg. Cost',
      otherAppText: '---',
      oneFoodPotAppText: '30-40%\nless',
      includeInOtherApp: false,
      includeInOneFoodPot: false,
    },
    {
      title: 'Service Fee',
      otherAppText: '',
      oneFoodPotAppText: '',
      includeInOtherApp: true,
      includeInOneFoodPot: false,
    },
    {
      title: 'Delivery Fee',
      otherAppText: '',
      oneFoodPotAppText: '',
      includeInOtherApp: true,
      includeInOneFoodPot: false,
    },
    {
      title: 'Small Order Fee',
      otherAppText: '',
      oneFoodPotAppText: '',
      includeInOtherApp: true,
      includeInOneFoodPot: false,
    },
    {
      title: 'Hot Food Guarantee!!',
      otherAppText: '',
      oneFoodPotAppText: '',
      includeInOtherApp: false,
      includeInOneFoodPot: true,
    },
  ];

  return (
    <View>
      <Text style={styles.whyOrder}>Why should you order from us?</Text>
      <View style={styles.orderContainer}>
        <View style={styles.headerView}>
          <Text style={[styles.header, styles.marginFirst]}>
            {'Other Food\nDelivery App'}
          </Text>
          <Text style={styles.header}>{'OneFood\nPot'}</Text>
        </View>
        <View style={styles.line} />
        <FlatList
          data={data}
          keyExtractor={({item, index}) => index?.toString()}
          renderItem={({item, index}) => {
            const {
              includeInOneFoodPot,
              includeInOtherApp,
              oneFoodPotAppText,
              otherAppText,
              title,
            } = item || {};

            return (
              <View
                style={[
                  styles.orderView,
                  index !== data.length - 1 && styles.bottom,
                ]}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.orderView}>
                  {otherAppText ? (
                    <Text style={[styles.value, styles.valueSpace]}>
                      {otherAppText}
                    </Text>
                  ) : (
                    <Icon
                      name={
                        includeInOtherApp
                          ? 'checkmark-outline'
                          : 'close-outline'
                      }
                      style={[styles.icon, styles.space]}
                      fill={'black'}
                    />
                  )}
                  {otherAppText ? (
                    <Text style={styles.value}>{oneFoodPotAppText}</Text>
                  ) : (
                    <Icon
                      name={
                        includeInOneFoodPot
                          ? 'checkmark-outline'
                          : 'close-outline'
                      }
                      style={[styles.icon, styles.spaceRight]}
                      fill={'black'}
                    />
                  )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.scroll}
        />
        <View style={styles.strip} />
      </View>
    </View>
  );
};

export default () => {
  const [recipeInfo, setRecipeInfo] = useState(null);
  const [location, setLocation] = useState([]);
  const [defaultLocation, setDefaultLocation] = useState({text: ''});
  const [dLocationId, setDloactionId] = useState('');

  const isFocus = useIsFocused();
  const {navigate} = useNavigation();
  const state = useSelector(initialState => initialState.reducer);

  const {isAuth} = state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(x => !x);

  const isF = useIsFocused();

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    (async () => {
      let allLocation = [];
      let dLocation = [];
      let showLocation = [];

      await Promise.all([
        API.apiService.get('/api/public/location').then(res => {
          allLocation = res?.data?.data;
        }),
        API.apiService.get('/api/recipe').then(res => {
          setRecipeInfo(res?.data?.data);
          dLocation = res?.data?.data?.deliveryLocation;
        }),
      ]);

      const lm = allLocation.map(x => ({
        ...x,
        text: x?.name + ' ' + x?.time,
        textStyle: {textTransform: 'capitalize'},
      }));

      setLocation(lm);
    })();
  }, [isFocus, isF]);

  const handleRedirect = () => {
    navigate('YelpReview', {url: recipeInfo?.yelpLink});
  };

  const handleOrderRedirect = () => {
    if (!isAuth) {
      navigate('Login');
      Toast.show({type: 'error', text1: 'Please login to make order'});
      return;
    }

    if (dLocationId) {
      navigate('Order', {
        locationId: dLocationId,
        name: defaultLocation?.text,
      });
      return;
    }

    Toast.show({type: 'error', text1: ' Please Select Your Location'});
  };

  if (recipeInfo === null) {
    return <></>;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={styles.container}>
        <AppHeader title={'Onefoodpot'} />
        <Divider />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <Layout
            style={{backgroundColor: '#faf3eb', padding: 15, paddingTop: 0}}>
            <Text style={[styles.whyOrder, styles.center]}>
              {recipeInfo?.remainingQuantity === 0
                ? 'Maximum number of orders reached !!! '
                : `We only have ${recipeInfo?.remainingQuantity} order remaining order soon!!!`}
            </Text>
            <Image
              style={{width: '100%', height: 250, marginBottom: 8}}
              resizeMode={'center'}
              source={{uri: `${imgBaseUrl}/api/file/${recipeInfo?.img}`}}
            />
            <Text category="h6" style={styles.styledText} appearance="default">
              {recipeInfo?.name}
            </Text>
            <Text appearance="hint" style={{fontSize: 18, marginBottom: 8}}>
              <Text category="label" style={{fontSize: 15}}>
                Offered by :{' '}
              </Text>
              <Text style={{textTransform: 'capitalize'}}>
                {recipeInfo?.offerdBy}
              </Text>
            </Text>
            <Button
              onPress={handleRedirect}
              style={{width: '40%', marginBottom: 8}}>
              Yelp Review
            </Button>
            <Text
              appearance="hint"
              style={{fontSize: 15, marginBottom: 8, color: '#333'}}>
              {recipeInfo?.description}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text
                category="h6"
                style={styles.styledText}
                appearance="default">
                <Text
                  category="label"
                  style={{textDecorationLine: 'line-through', fontSize: 18}}>
                  $ {recipeInfo?.regularPrice}
                </Text>
                {'  $'} {recipeInfo?.discountPrice}
              </Text>
              <Select
                onSelect={val => {
                  setDefaultLocation(val);
                  setDloactionId(val?._id);
                }}
                selectedOption={defaultLocation}
                textStyle={{textTransform: 'capitalize'}}
                style={{width: '60%'}}
                data={location}
              />
            </View>
            <Button
              style={{marginBottom: 8}}
              onPress={handleOrderRedirect}
              disabled={recipeInfo?.remainingQuantity === 0}>
              Order Now
            </Button>
            {/* <Button
              style={{marginBottom: 8}}
              // onPress={toggleModal}
              onPress={() => navigate('WhyOrder')}>
              Why you should order from us ?
            </Button> */}
            <RenderWhyShouldOrderView />
          </Layout>
        </ScrollView>
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
  scrollView: {
    paddingBottom: 60,
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
  whyOrder: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 10,
    color: '#e88f2a',
  },
  orderContainer: {
    backgroundColor: '#faf3eb',
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 2,
      height: 0,
    },
    elevation: 5,
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 16,
    paddingLeft: 16,
  },
  orderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 38,
  },
  header: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 95,
    textAlign: 'center',
  },
  line: {
    height: 0.5,
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    marginBottom: 10,
  },
  marginFirst: {
    marginRight: 55,
  },
  bottom: {
    marginBottom: 20,
  },
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    maxWidth: 150,
  },
  value: {
    color: 'black',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  valueSpace: {
    marginRight: 92,
  },
  icon: {
    height: 20,
    width: 20,
  },
  space: {
    marginRight: 105,
  },
  strip: {
    backgroundColor: '#e88f2a',
    position: 'absolute',
    height: '112%',
    width: 100,
    right: 15,
    zIndex: -1,
  },
  spaceRight: {
    marginRight: 15,
  },
  scroll: {
    marginRight: 40,
  },
});
