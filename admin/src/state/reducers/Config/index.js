/**
 *
 * Main reducer
 *
 */

import { fromJS, Map } from 'immutable';
import { SET_CONFIG_DIFF_IN_STATE, SET_LOADING_STATE } from '../../actions/Config';

const initialState = fromJS({
  configDiff: Map({}),
  isLoading: false,
});

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONFIG_DIFF_IN_STATE:
      return state
        .update('configDiff', () => fromJS(action.config))
    case SET_LOADING_STATE:
      return state
        .update('isLoading', () => fromJS(action.value))
    default:
      return state;
  }
}