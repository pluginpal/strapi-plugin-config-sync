/**
 *
 * Main actions
 *
 */

import { request } from '@strapi/helper-plugin';
import { Map } from 'immutable';

export function getAllConfigDiff() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const configDiff = await request('/config-sync/diff', { method: 'GET' });
      dispatch(setConfigDiffInState(configDiff));
      dispatch(setLoadingState(false));
    } catch (err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  };
}

export const SET_CONFIG_DIFF_IN_STATE = 'SET_CONFIG_DIFF_IN_STATE';
export function setConfigDiffInState(config) {
  return {
    type: SET_CONFIG_DIFF_IN_STATE,
    config,
  };
}

export function exportAllConfig() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const { message } = await request('/config-sync/export', { method: 'GET' });
      dispatch(setConfigDiffInState(Map({})));

      strapi.notification.success(message);
      dispatch(setLoadingState(false));
    } catch (err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  };
}

export function importAllConfig() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const { message } = await request('/config-sync/import', { method: 'GET' });
      dispatch(setConfigDiffInState(Map({})));

      strapi.notification.success(message);
      dispatch(setLoadingState(false));
    } catch (err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  };
}

export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export function setLoadingState(value) {
  return {
    type: SET_LOADING_STATE,
    value,
  };
}
