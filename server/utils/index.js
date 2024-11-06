'use strict';

const COMBINED_UID_JOINSTR = '.combine-uid.';

const escapeUid = (uid) => typeof uid === "string" ? uid.replace(/\.combine-uid\./g, '.combine-uid-escape.') : uid;
const unEscapeUid = (uid) => typeof uid === "string" ? uid.replace(/\.combine-uid-escape\./g, '.combine-uid.') : uid;
export const getCombinedUid = (uidKeys, params) => uidKeys.map((uidKey) => escapeUid(params[uidKey])).join(COMBINED_UID_JOINSTR);
export const getCombinedUidWhereFilter = (uidKeys, params) => uidKeys.reduce(((akku, uidKey) => ({ ...akku, [uidKey]: params[uidKey] })), {});
export const getUidParamsFromName = (uidKeys, configName) => configName.split(COMBINED_UID_JOINSTR).map(unEscapeUid).reduce((akku, param, i) => ({ ...akku, [uidKeys[i]]: param }), {});

export const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'config-sync' });
};

export const getService = (name) => {
  return strapi.plugin('config-sync').service(name);
};

export const logMessage = (msg = '') => `[strapi-plugin-config-sync]: ${msg}`;

const sortByKeys = (unordered) => {
  return Object.keys(unordered).sort().reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    },
    {},
  );
};

export const dynamicSort = (property) => {
  let sortOrder = 1;

  if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }

  return (a, b) => {
    if (sortOrder === -1) {
      if (b[property]) {
        return b[property].localeCompare(a[property]);
      }
    } else if (a[property]) {
      return a[property].localeCompare(b[property]);
    }
  };
};

export const sanitizeConfig = ({
  config,
  relation,
  relationSortFields,
  configName,
}) => {
  delete config._id;
  delete config.id;
  delete config.updatedAt;
  delete config.createdAt;
  delete config.publishedAt;

  if (relation) {
    const formattedRelations = [];

    config[relation].map((relationEntity) => {
      delete relationEntity._id;
      delete relationEntity.id;
      delete relationEntity.updatedAt;
      delete config.publishedAt;
      delete relationEntity.createdAt;
      relationEntity = sortByKeys(relationEntity);

      formattedRelations.push(relationEntity);
    });

    if (relationSortFields) {
      relationSortFields.map((sortField) => {
        formattedRelations.sort(dynamicSort(sortField));
      });
    }

    config[relation] = formattedRelations;
  }

  // We recursively sanitize the config to remove environment specific data.
  // Except for the plugin_content_manager_configuration.
  // This is because that stores the "edit the view" data which includes only configuration, not content.
  if (configName && !configName.startsWith('plugin_content_manager_configuration_')) {
    const recursiveSanitizeConfig = (recursivedSanitizedConfig) => {
      delete recursivedSanitizedConfig._id;
      delete recursivedSanitizedConfig.id;
      delete recursivedSanitizedConfig.updatedAt;
      delete recursivedSanitizedConfig.createdAt;

      Object.keys(recursivedSanitizedConfig).map((key, index) => {
        if (recursivedSanitizedConfig[key] && typeof recursivedSanitizedConfig[key] === "object") {
          recursiveSanitizeConfig(recursivedSanitizedConfig[key]);
        }
      });
    };

    recursiveSanitizeConfig(config);
  }

  return config;
};

export const noLimit = async (query, parameters, limit = 100) => {
  let entries = [];
  const amountOfEntries = await query.count(parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await query.findMany({
      ...parameters,
      limit: limit,
      offset: (i * limit),
      orderBy: 'id',
    });
    entries = [...chunk, ...entries];
  }

  return entries;
};
