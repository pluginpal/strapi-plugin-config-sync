/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import { Page } from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import Header from '../../components/Header';
import { store } from "../../helpers/configureStore";
import ConfigPage from '../ConfigPage';

const App = () => {
  return (
    <Page.Protect permissions={pluginPermissions.settings}>
      <Provider store={store}>
        <Header />
        <ConfigPage />
      </Provider>
    </Page.Protect>
  );
};

export default App;
