/**
 *
 * Main actions
 *
 */

import { request } from 'strapi-helper-plugin';
import { Map } from 'immutable';

export function getAllConfig() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const databaseConfig = await request('/config/all/from-database', { method: 'GET' });
      const fileConfig = await request('/config/all/from-files', { method: 'GET' });
      dispatch(setFileConfigInState(fileConfig));
      dispatch(setDatabaseConfigInState(databaseConfig));
      dispatch(setLoadingState(false));
    } catch(err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  }
}

export const SET_DATABASE_CONFIG_IN_STATE = 'SET_DATABASE_CONFIG_IN_STATE';
export function setDatabaseConfigInState(config) {
  return {
    type: SET_DATABASE_CONFIG_IN_STATE,
    config,
  };
}

export const SET_FILE_CONFIG_IN_STATE = 'SET_FILE_CONFIG_IN_STATE';
export function setFileConfigInState(config) {
  return {
    type: SET_FILE_CONFIG_IN_STATE,
    config,
  };
}

export function exportAllConfig() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const { message } = await request('/config/export', { method: 'GET' });
      dispatch(setFileConfigInState(Map({})));
      dispatch(setDatabaseConfigInState(Map({})));

      strapi.notification.success(message);
      dispatch(setLoadingState(false));
    } catch(err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  }
}

export function importAllConfig() {
  return async function(dispatch) {
    dispatch(setLoadingState(true));
    try {
      const { message } = await request('/config/import', { method: 'GET' });
      dispatch(setFileConfigInState(Map({})));
      dispatch(setDatabaseConfigInState(Map({})));

      strapi.notification.success(message);
      dispatch(setLoadingState(false));
    } catch(err) {
      strapi.notification.error('notification.error');
      dispatch(setLoadingState(false));
    }
  }
}

export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export function setLoadingState(value) {
  return {
    type: SET_LOADING_STATE,
    value,
  };
}