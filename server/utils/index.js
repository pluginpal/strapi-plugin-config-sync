'use strict';

const COMBINED_UID_JOINSTR = '+.+';

const escapeUid = (uid) => typeof uid === "string" ? uid.replace(/\+\.\+/g, '+_._+') : uid;
const unEscapeUid = (uid) => typeof uid === "string" ? uid.replace(/\+_\._\+_/g, '+.+') : uid;
const getCombinedUid = (uidKeys, params) => {
  const res = uidKeys.map((uidKey) => escapeUid(params[uidKey])).join(COMBINED_UID_JOINSTR);
  console.log("getCombinedUid", res);
  return res;
};
const getCombinedUidWhereFilter = (uidKeys, params) => uidKeys.reduce(((akku, uidKey) => ({ ...akku, [uidKey]: params[uidKey] })), {});
const getUidParamsFromName = (uidKeys, configName) => {
  const res = configName.split(COMBINED_UID_JOINSTR).map(unEscapeUid).reduce((akku, param, i) => ({ ...akku, [uidKeys[i]]: param }), {});
  console.log("getUidParamsFromName", res);
  return res;
};

const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'config-sync' });
};

const getService = (name) => {
  return strapi.plugin('config-sync').service(name);
};

const logMessage = (msg = '') => `[strapi-plugin-config-sync]: ${msg}`;

const sortByKeys = (unordered) => {
  return Object.keys(unordered).sort().reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    },
    {},
  );
};

const dynamicSort = (property) => {
  let sortOrder = 1;

  if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }

  return (a, b) => {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

const sanitizeConfig = (config, relation, relationSortField) => {
  delete config._id;
  delete config.id;
  delete config.updatedAt;
  delete config.createdAt;

  if (relation) {
    const formattedRelations = [];

    config[relation].map((relationEntity) => {
      delete relationEntity._id;
      delete relationEntity.id;
      delete relationEntity.updatedAt;
      delete relationEntity.createdAt;
      relationEntity = sortByKeys(relationEntity);

      formattedRelations.push(relationEntity);
    });

    if (relationSortField) {
      formattedRelations.sort(dynamicSort(relationSortField));
    }

    config[relation] = formattedRelations;
  }

  return config;
};

const noLimit = async (query, parameters, limit = 100) => {
  let entries = [];
  const amountOfEntries = await query.count(parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await query.findMany({
      ...parameters,
      limit: limit,
      offset: (i * limit),
    });
    entries = [...chunk, ...entries];
  }

  return entries;
};

module.exports = {
  getCombinedUid,
  getCombinedUidWhereFilter,
  getUidParamsFromName,
  getService,
  getCoreStore,
  logMessage,
  sanitizeConfig,
  sortByKeys,
  dynamicSort,
  noLimit,
};
