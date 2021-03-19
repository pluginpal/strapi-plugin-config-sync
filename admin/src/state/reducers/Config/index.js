/**
 *
 * Main reducer
 *
 */

import { fromJS, Map } from 'immutable';
import { EXAMPLE_ACTION } from '../../actions/Config';

const initialState = fromJS({});

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case EXAMPLE_ACTION:
    return state
      .update('value', () => action.value)
    default:
      return state;
  }
}