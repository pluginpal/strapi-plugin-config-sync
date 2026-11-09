/**
 *
 * Main actions
 *
 */
import { saveAs } from 'file-saver';
import { b64toBlob } from '../../helpers/blob';

const getSyncErrorMessage = (err, formatMessage) => {
  const details = err?.response?.data?.error?.details;
  if (details?.code === 'CONFIG_SYNC_INVALID_FILE' && typeof details.configName === 'string') {
    if (details.reason === 'invalid_json') {
      return formatMessage({ id: 'config-sync.notification.invalidJson' }, { configName: details.configName });
    }
    if (details.reason === 'no_database_config') {
      return formatMessage({ id: 'config-sync.notification.noDatabaseConfig' }, { configName: details.configName });
    }
  }
  return formatMessage({ id: 'notification.error' });
};

export function getAllConfigDiff(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const configDiff = await get('/config-sync/diff');
      dispatch(setConfigPartialDiffInState([]));
      dispatch(setConfigDiffInState(configDiff.data));
      dispatch(setLoadingState(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
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

export function exportAllConfig(partialDiff, toggleNotification, formatMessage, post, get, onError) {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const response = await post('/config-sync/export', partialDiff);
      toggleNotification({ type: 'success', message: response.data.message });
      await dispatch(getAllConfigDiff(toggleNotification, formatMessage, get));
      return true;
    } catch (err) {
      const message = getSyncErrorMessage(err, formatMessage);
      if (onError) onError(message);
      else toggleNotification({ type: 'warning', message });
      dispatch(setLoadingState(false));
      return false;
    }
  };
}

export function downloadZip(toggleNotification, formatMessage, post, get) {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const { message, base64Data, name } = (await get('/config-sync/zip')).data;
      toggleNotification({ type: 'success', message });
      if (base64Data) {
        saveAs(b64toBlob(base64Data, 'application/zip'), name, { type: 'application/zip' });
      }
      dispatch(setLoadingState(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      dispatch(setLoadingState(false));
    }
  };
}

export function importAllConfig(partialDiff, force, toggleNotification, formatMessage, post, get, onError) {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const response = await post('/config-sync/import', {
        force,
        config: partialDiff,
      });
      toggleNotification({ type: 'success', message: response.data.message });
      await dispatch(getAllConfigDiff(toggleNotification, formatMessage, get));
      return true;
    } catch (err) {
      const message = getSyncErrorMessage(err, formatMessage);
      if (onError) onError(message);
      else toggleNotification({ type: 'warning', message });
      dispatch(setLoadingState(false));
      return false;
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

export function getAppEnv(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const envVars = await get('/config-sync/app-env');
      dispatch(setAppEnvInState(envVars.data));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
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
