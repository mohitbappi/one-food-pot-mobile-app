/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-fallthrough */
/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {
  Divider,
  Icon,
  OverflowMenu,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {DeleteUserAccountService} from '../Services/PaymentServices';

const MenuIcon = style => <Icon {...style} name="menu-outline" fill={'#333'} />;

const InfoIcon = style => (
  <Icon {...style} name="log-in-outline" fill={'#333'} />
);

const PersonIcon = style => (
  <Icon {...style} name="person-outline" fill={'#333'} />
);
const OrderIcon = style => (
  <Icon {...style} name="shopping-bag-outline" fill={'#333'} />
);
const LogoutIcon = style => (
  <Icon {...style} name="log-out-outline" fill={'#333'} />
);
const DeleteIcon = style => (
  <Icon {...style} name="person-delete-outline" fill={'#333'} />
);

const AppHeader = ({title}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const initialState = useSelector(state => state.reducer);
  const {isAuth} = initialState;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState([
    {
      title: 'Login',
      icon: InfoIcon,
    },
  ]);

  const dispatch = useDispatch();

  const {navigate} = useNavigation();

  useEffect(() => {
    if (isAuth) {
      setMenuData([
        {
          title: 'My Profile',
          icon: PersonIcon,
          titleStyle: {color: '#333'},
        },
        {
          title: 'My Order',
          icon: OrderIcon,
          titleStyle: {color: '#333'},
        },
        {
          title: 'Delete Account',
          icon: DeleteIcon,
          titleStyle: {color: '#333'},
        },
        {
          title: 'Logout',
          icon: LogoutIcon,
          titleStyle: {color: '#333'},
        },
      ]);
    } else {
      setMenuData([
        {
          title: 'Login',
          icon: InfoIcon,
        },
      ]);
    }
  }, [initialState]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const DeleteUserAccount = async () => {
    try {
      setLoading(true);
      const res = await DeleteUserAccountService(initialState?.token);
      if (res?.success) {
        dispatch({type: 'AUTH_OUT'});
        navigate('Home');
        setLoading(false);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onMenuItemSelect = index => {
    if (isAuth) {
      switch (index) {
        case 0:
          setMenuVisible(false);
          navigate('Profile');
          return;
        case 1:
          setMenuVisible(false);
          navigate('MyOrder');
          return;
        case 2:
          setShowModal(true);
          setMenuVisible(false);
          return;
        case 3:
          dispatch({type: 'AUTH_OUT'});
          setMenuVisible(false);
          navigate('Home');
          return;
        default:
          break;
      }
    } else {
      switch (index) {
        case 0:
          navigate('Login');
          setMenuVisible(false);
        default:
          break;
      }
    }
  };

  const handleNavigate = () => navigate('Home');

  const renderMenuAction = () => (
    <OverflowMenu
      visible={menuVisible}
      data={menuData}
      onSelect={onMenuItemSelect}
      onBackdropPress={toggleMenu}>
      <TopNavigationAction
        style={styles.bgOrange}
        icon={MenuIcon}
        onPress={toggleMenu}
      />
    </OverflowMenu>
  );

  const renderTitle = () => {
    return (
      <View
        onTouchStart={handleNavigate}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: Platform.OS === 'android' ? 0 : 0,
        }}>
        <Image
          source={{uri: 'https://i.ibb.co/92JF9W1/logo.png'}}
          style={{margin: 16, width: 40, height: 25}}
          resizeMode="contain"
        />
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{title}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={{marginVertical: -10, marginBottom: -15}}>
        <TopNavigation
          style={styles.bgOrange}
          leftControl={renderTitle()}
          rightControls={renderMenuAction()}
        />
      </View>
      <Divider />
      <Modal
        visible={showModal}
        backdropColor={'black'}
        hasBackdrop
        backdropOpacity={0.7}
        onBackButtonPress={() => {
          setShowModal(false);
        }}>
        <View style={styles.modalContainer}>
          <Icon style={styles.icon} fill={'#FF0000'} name={'trash-2-outline'} />
          <Text style={styles.confirmTextStyle}>
            {'Are you sure you want to delete your account?'}
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setShowModal(false);
              }}>
              <Text style={{color: '#333'}}>{'Cancel'}</Text>
            </Pressable>
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                DeleteUserAccount();
              }}>
              {(loading && (
                <ActivityIndicator size={'small'} color={'white'} />
              )) || <Text style={{color: 'white'}}>{'Delete'}</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>
      {(showModal && (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={'#e88f2a'} />
        </View>
      )) ||
        null}
    </>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
    flex: 1,
    backgroundColor: '#faf3eb',
  },
  bgOrange: {
    backgroundColor: '#faf3eb',
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
    marginBottom: 30,
    width: '80%',
    textAlign: 'center',
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
  deleteButton: {
    backgroundColor: '#e88f2a',
    paddingHorizontal: 20,
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
