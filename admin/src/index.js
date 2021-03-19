import React from 'react';
import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import trads from './translations';

function Comp(props) {
  return <App {...props} />;
}

export default strapi => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;

  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    icon,
    name,
    destination: `/plugins/${pluginId}`,
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    layout: null,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: Comp,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`, // Endpoint of the link
          icon,
          name,
          label: {
            id: `${pluginId}.plugin.name`, // Refers to a i18n
            defaultMessage: 'Config Sync',
          },
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
