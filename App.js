/* eslint-disable react-hooks/exhaustive-deps */
import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React, {useEffect} from 'react';
import {LogBox, StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import {Routes} from './src/routes/index';
import {myTheme} from './theme';
import {StripeProvider} from '@stripe/stripe-react-native';
import {default as mapping} from './mapping.json';
import {Freshchat, FreshchatConfig} from 'react-native-freshchat-sdk';
import Config from 'react-native-config';
import {Provider} from 'react-redux';
import {store} from './src/state/store';
import {API} from './src/axios.config';

// emulator -avd Nexus_5X_API_26 -gpu host -noskin -cores 1
// onefoodpot@gmail.com Ganesh16!

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'fontFamily']);
    configureFreshChat();
    API.initService();
  }, []);

  const configureFreshChat = () => {
    let freshchatConfig = new FreshchatConfig(
      Config.FRESHCHAT_APP_ID,
      Config.FRESHCHAT_API_KEY,
    );
    freshchatConfig.domain = Config.FRESHCHAT_DOMAIN;
    freshchatConfig.cameraCaptureEnabled = false;
    Freshchat.init(freshchatConfig);
  };

  return (
    <StripeProvider
      publishableKey={Config.STRIPE_KEY}
      merchantIdentifier={Config.STRIPE_MERCHANT_ID}>
      <Provider store={store}>
        <ApplicationProvider
          customMapping={mapping}
          {...eva}
          theme={{...eva.light, ...myTheme}}>
          <IconRegistry icons={EvaIconsPack} />
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
          <Toast />
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'transparent'}
          />
        </ApplicationProvider>
      </Provider>
    </StripeProvider>
  );
};

export default App;
