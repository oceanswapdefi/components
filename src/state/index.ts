import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';
import papplication from './papplication/reducer';
import plists from './plists/reducer';
import pmulticall from './pmulticall/reducer';
import pswap from './pswap/reducer';
import ptoken from './ptoken/reducer';
import ptransactions from './ptransactions/reducer';
import puser from './puser/reducer';
import pwatchlists from './pwatchlists/reducer';

export const PANGOLIN_PERSISTED_KEYS: string[] = [
  'puser',
  'plists',
  'ptransactions',
  'pwatchlists',
  'ptoken',
];

export const pangolinReducers = {
  papplication,
  ptransactions,
  pswap,
  plists,
  pmulticall,
  puser,
  pwatchlists,
  ptoken,
};

const store = configureStore({
  reducer: pangolinReducers,
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PANGOLIN_PERSISTED_KEYS })],
  preloadedState: load({ states: PANGOLIN_PERSISTED_KEYS }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
