import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';

import {reducer} from './app.reducer';

const combinedReducer = combineReducers({
  reducer,
});

const rootReducer = (state, action) => {
  let stateData = state;
  if (action.type === 'AUTH_OUT') {
    stateData = {};
  }

  return combinedReducer(stateData, action);
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
