import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';

import rootReducer from '../state/reducers';
import { __DEBUG__ } from '../config/constants';

const configureStore = () => {
  const initialStoreState = Map();

  const enhancers = [];
  const middlewares = [
    thunkMiddleware,
  ];

  let devtools;

  if (__DEBUG__) {
    devtools = (
      typeof window !== 'undefined'
      && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'
      && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] })
    );

    if (devtools) {
      console.info('[setup] ✓ Enabling Redux DevTools Extension');
    }
  }

  const composedEnhancers = devtools || compose;
  const storeEnhancers = composedEnhancers(
    applyMiddleware(...middlewares),
    ...enhancers,
  );

  const store = createStore(
    rootReducer,
    initialStoreState,
    storeEnhancers,
  );

  return store;
};

export default configureStore;

export const store = configureStore();
