const queryFallBack = {
  create: async (queryString, options) => {
    try {
      const newEntity = await strapi.documents(queryString).create(options);

      return newEntity;
    } catch (e) {
      return strapi.query(queryString).create(options);
    }
  },
  update: async (queryString, options) => {
    try {
      const entity = await strapi.query(queryString).findOne(options);
      const updatedEntity = await strapi.documents(queryString).update({
        documentId: entity.documentId,
        ...options,
      });

      return updatedEntity;
    } catch (e) {
      return strapi.query(queryString).update(options);
    }
  },
  delete: async (queryString, options) => {
    try {
      const entity = await strapi.query(queryString).findOne(options);
      await strapi.documents(queryString).delete({
        documentId: entity.documentId,
      });
    } catch (e) {
      await strapi.query(queryString).delete(options);
    }
  },
};

export default queryFallBack;
