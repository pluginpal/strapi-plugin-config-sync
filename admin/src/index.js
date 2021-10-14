import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';
// import pluginPermissions from './permissions';
// import getTrad from './helpers/getTrad';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { icon, name } = pluginPkg.strapi;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      icon,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Config Sync',
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "config-sync-settings-page" */ './containers/App'
        );

        return component;
      },
      permissions: [], // TODO: Add permission to view settings page.
    });
  },
  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "config-sync-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
