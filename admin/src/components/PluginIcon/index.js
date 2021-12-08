/**
 *
 * PluginIcon
 *
 */

import React from 'react';
import { Icon } from '@strapi/design-system/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import pluginPkg from '../../../../package.json';

const PluginIcon = () => <Icon as={() => <FontAwesomeIcon icon={pluginPkg.strapi.icon} />} width="16px" />;

export default PluginIcon;
