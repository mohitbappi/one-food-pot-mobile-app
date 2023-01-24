import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';

import {persistedReducer} from './root-reducer';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: !__DEV__,
      serializableCheck: !__DEV__,
    }),
});

persistStore(store);
