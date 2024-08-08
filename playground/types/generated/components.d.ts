import type { Schema, Attribute } from '@strapi/strapi';

export interface CoreProfile extends Schema.Component {
  collectionName: 'components_core_profiles';
  info: {
    displayName: 'Profile';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    ContactInfo: Attribute.Component<'core.contact-info', true>;
  };
}

export interface CoreContactInfo extends Schema.Component {
  collectionName: 'components_core_contact_infos';
  info: {
    displayName: 'ContactInfo';
  };
  attributes: {
    Phonenumber: Attribute.String;
    Email: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'core.profile': CoreProfile;
      'core.contact-info': CoreContactInfo;
    }
  }
}
