/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import ContainerFluid from '../../components/Container';
import Header from '../../components/Header';

import { store } from "../../helpers/configureStore";
import ConfigPage from '../ConfigPage';

const App = () => {
  return (
    <Provider store={store}>
      <ContainerFluid>
        <Header />
        <ConfigPage />
      </ContainerFluid>
    </Provider>
  );
};

export default App;
