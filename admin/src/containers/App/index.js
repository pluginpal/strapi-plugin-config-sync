/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import { CheckPagePermissions, useNotification } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import Header from '../../components/Header';
import store from "../../helpers/configureStore";
import ConfigPage from '../ConfigPage';

const App = () => {
  const toggleNotification = useNotification();

  return (
    <CheckPagePermissions permissions={pluginPermissions.settings}>
      <Provider store={store(toggleNotification)}>
        <Header />
        <ConfigPage />
      </Provider>
    </CheckPagePermissions>
  );
};

export default App;
