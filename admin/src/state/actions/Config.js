/**
 *
 * Main actions
 *
 */

import { useFetchClient } from '@strapi/admin/strapi-admin';

export function getAllConfigDiff(toggleNotification) {
  return async function(dispatch) {
    const { get } = useFetchClient();
    dispatch(setLoadingState(true));
    try {
      const configDiff = await get('/config-sync/diff');
      dispatch(setConfigPartialDiffInState([]));
      dispatch(setConfigDiffInState(configDiff));
      dispatch(setLoadingState(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
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

export const SET_CONFIG_PARTIAL_DIFF_IN_STATE = 'SET_CONFIG_PARTIAL_DIFF_IN_STATE';
export function setConfigPartialDiffInState(config) {
  return {
    type: SET_CONFIG_PARTIAL_DIFF_IN_STATE,
    config,
  };
}

export function exportAllConfig(partialDiff, toggleNotification) {
  return async function(dispatch) {
    const { post } = useFetchClient();
    dispatch(setLoadingState(true));
    try {
      const response = await post('/config-sync/export', partialDiff);
      toggleNotification({ type: 'success', response });
      dispatch(getAllConfigDiff(toggleNotification));
      dispatch(setLoadingState(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      dispatch(setLoadingState(false));
    }
  };
}

export function importAllConfig(partialDiff, force, toggleNotification) {
  return async function(dispatch) {
    const { post } = useFetchClient();
    dispatch(setLoadingState(true));
    try {
      const response = await post('/config-sync/import', {
        force,
        config: partialDiff,
      });
      toggleNotification({ type: 'success', response });
      dispatch(getAllConfigDiff(toggleNotification));
      dispatch(setLoadingState(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
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

export function getAppEnv(toggleNotification) {
  return async function(dispatch) {
    const { get } = useFetchClient();
    try {
      const envVars = await get('/config-sync/app-env');
      dispatch(setAppEnvInState(envVars));
    } catch (err) {
      toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
}

export const SET_APP_ENV_IN_STATE = 'SET_APP_ENV_IN_STATE';
export function setAppEnvInState(value) {
  return {
    type: SET_APP_ENV_IN_STATE,
    value,
  };
}
