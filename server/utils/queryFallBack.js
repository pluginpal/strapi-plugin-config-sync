const queryFallBack = {
  create: async (queryString, options) => {
    try {
      const newEntity = await strapi.entityService.create(queryString, options);

      return newEntity;
    } catch (e) {
      return strapi.query(queryString).create(options);
    }
  },
  update: async (queryString, options) => {
    try {
      const entity = await strapi.query(queryString).findOne(options);
      const updatedEntity = await strapi.entityService.update(queryString, entity.id, options);

      return updatedEntity;
    } catch (e) {
      return strapi.query(queryString).update(options);
    }
  },
  delete: async (queryString, options) => {
    try {
      const entity = await strapi.query(queryString).findOne(options);
      await strapi.entityService.delete(queryString, entity.id);
    } catch (e) {
      await strapi.query(queryString).delete(options);
    }
  },
};

module.exports = queryFallBack;
