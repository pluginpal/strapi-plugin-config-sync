import { combineReducers } from 'redux-immutable';
import configReducer from './Config';

const rootReducer = combineReducers({
  config: configReducer,
});

export default rootReducer;
