/**
 *
 * Main actions
 *
 */

import { request } from 'strapi-helper-plugin';
import { Map } from 'immutable';

export function getAllDatabaseConfig() {
  return async function(dispatch) {
    try {
      const data = await request('/config/all/from-database', { method: 'GET' });
      dispatch(setDatabaseConfigInState(data));

      strapi.notification.success('woop!');
    } catch(err) {
      console.log(err);
      strapi.notification.error('notification.error');
    }
  }
}

export function getAllFileConfig() {
  return async function(dispatch) {
    try {
      const data = await request('/config/all/from-files', { method: 'GET' });
      dispatch(setFileConfigInState(data));

      strapi.notification.success('woop!');
    } catch(err) {
      console.log(err);
      strapi.notification.error('notification.error');
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
    try {
      const { message } = await request('/config/export', { method: 'GET' });
      dispatch(getAllFileConfig());
      dispatch(getAllDatabaseConfig());

      strapi.notification.success(message);
    } catch(err) {
      console.log(err);
      strapi.notification.error('notification.error');
    }
  }
}

export function importAllConfig() {
  return async function(dispatch) {
    try {
      const { message } = await request('/config/import', { method: 'GET' });
      dispatch(getAllFileConfig());
      dispatch(getAllDatabaseConfig());

      strapi.notification.success(message);
    } catch(err) {
      console.log(err);
      strapi.notification.error('notification.error');
    }
  }
}