import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';
import pluginPermissions from './permissions';
// import pluginIcon from './components/PluginIcon';
// import getTrad from './helpers/getTrad';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Config Sync',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.Settings.Tool.Title`,
            defaultMessage: 'Tools',
          },
          id: 'config-sync-page',
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "config-sync-settings-page" */ './containers/App'
            );

            return component;
          },
          permissions: pluginPermissions['settings'],
        },
      ],
    );
  },
  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
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
