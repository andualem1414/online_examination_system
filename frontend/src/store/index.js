// third-party
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

// Configure the persist options
const persistConfig = {
  key: 'root',
  storage
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({ reducer: persistedReducer });

// Create the persisted store
export const persistedStore = persistStore(store);

const { dispatch } = store;

export { store, dispatch };
