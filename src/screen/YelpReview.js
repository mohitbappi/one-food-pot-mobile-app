import {useRoute} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf3eb',
  },
});

const YelpReview = () => {
  const {params} = useRoute();

  const Loading = () => {
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="yellow" />
    </SafeAreaView>;
  };
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webView}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        renderLoading={() => {
          Loading();
        }}
        source={{uri: params?.url}}
      />
    </SafeAreaView>
  );
};

export {YelpReview};
