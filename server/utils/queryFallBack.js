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
      const entity = await strapi.query(queryString).findOne(options.where);
      const updatedEntity = await strapi.entityService.update(queryString, entity.id);

      return updatedEntity;
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
