import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';

import rootReducer from '../state/reducers';
import loggerConfig from '../config/logger';
import { __DEBUG__ } from '../config/constants';

const configureStore = () => {
  let initialStoreState = Map();

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

    console.info('[setup] ✓ Enabling state logger');
    const loggerMiddleware = createLogger({
      level: 'info',
      collapsed: true,
      stateTransformer: (state) => state.toJS(),
      predicate: (getState, action) => {
        const state = getState();

        const showBlacklisted = state.getIn(['debug', 'logs', 'blacklisted']);
        if (loggerConfig.blacklist.indexOf(action.type) !== -1 && !showBlacklisted) {
          return false;
        }

        return state.getIn(['debug', 'logs', 'enabled']);
      },
    });
    middlewares.push(loggerMiddleware);
  }

  const composedEnhancers = devtools || compose;
  const storeEnhancers = composedEnhancers(
    applyMiddleware(...middlewares),
    ...enhancers
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
