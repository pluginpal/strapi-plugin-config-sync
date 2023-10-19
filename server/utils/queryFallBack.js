const queryFallBack = {
  create: async (queryString, options) => {
    try {
      return strapi.entityService.create(queryString, options);
    } catch (e) {
      return strapi.query(queryString).create(options);
    }
  },
  update: async (queryString, options) => {
    try {
      const entity = await strapi.query(queryString).findOne(options.where);
      return strapi.entityService.update(queryString, entity.id);
    } catch (e) {
      return strapi.query(queryString).update(options);
    }
  },
  delete: async (queryString, id) => {
    try {
      await strapi.entityService.delete(queryString, id);
    } catch (e) {
      await strapi.query(queryString).delete({
        where: { id },
      });
    }
  },
};

module.exports = queryFallBack;
