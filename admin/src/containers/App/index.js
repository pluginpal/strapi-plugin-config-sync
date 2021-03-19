/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
import { Provider } from 'react-redux';

import { store } from "../../helpers/configureStore";
import pluginId from '../../helpers/pluginId';
import ConfigPage from '../ConfigPage';

const App = () => {
  return (
    <Provider store={store}>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={ConfigPage} exact />
        <Route component={NotFound} />
      </Switch>
    </Provider>
  );
};

export default App;
