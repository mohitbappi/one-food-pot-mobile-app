import React, {useEffect, useState} from 'react';
import {Pressable, Image, StyleSheet} from 'react-native';
import {
  Freshchat,
  FreshchatUser,
  ConversationOptions,
} from 'react-native-freshchat-sdk';
import {useSelector} from 'react-redux';
import {API} from '../axios.config';

const ChatBot = () => {
  const [userInfo, setUserInfo] = useState({});
  const state = useSelector(initialState => initialState.reducer);

  useEffect(() => {
    if (state?.token?.length) {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserInfo = async () => {
    const user = await API.apiService.get('/api/user/auth/user');
    if (user?.data?.success) {
      setUserInfo(user?.data?.data);
    }
  };

  return (
    <Pressable
      onPress={() => {
        if (state?.token?.length) {
          console.log('token', state?.token);
          var freshchatUser = new FreshchatUser();
          freshchatUser.firstName = userInfo?.name;
          freshchatUser.email = userInfo?.email;
          freshchatUser.phone = userInfo?.mobile;
          console.log(freshchatUser);
          Freshchat.setUser(freshchatUser, error => {
            console.log(error);
          });
        }
        const conversationOptions = new ConversationOptions();
        conversationOptions.tags = ['premium'];
        Freshchat.showConversations(conversationOptions);
      }}
      style={styles.container}>
      <Image source={{uri: 'chatbot_icon'}} style={styles.image} />
    </Pressable>
  );
};

export {ChatBot};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 30,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
});
