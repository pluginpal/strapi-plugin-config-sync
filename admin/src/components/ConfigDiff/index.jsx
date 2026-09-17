import React from 'react';
import { useDispatch } from 'react-redux';
import RDV, { DiffMethod } from 'react-diff-viewer-continued';
import { useIntl } from 'react-intl';
import { getFetchClient, useNotification } from '@strapi/strapi/admin';

/**
 * An issue with the diff-viewer library causes a difference in the way the library is exported.
 * Depending on whether the library is loaded through the browser or through the server, the default export may or may not be present.
 * This causes issues with SSR and the way the library is imported.
 *
 * Below a workaround to fix this issue.
 *
 * @see https://github.com/Aeolun/react-diff-viewer-continued/issues/43
 */
let ReactDiffViewer;
if (typeof RDV.default !== 'undefined') {
  ReactDiffViewer = RDV.default;
} else {
  ReactDiffViewer = RDV;
}

import {
  Button,
  Modal,
  Grid,
  Typography,
} from '@strapi/design-system';
import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig } from '../../state/actions/Config';

const ConfigDiff = ({ oldValue, newValue, configName, trigger }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { post, get } = getFetchClient();
  const commonHeadingStyle = { paddingRight: '2rem' };

  return (
    <Modal.Root>
      <Modal.Trigger>
        {trigger}
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Typography variant="omega" fontWeight="bold" textColor="neutral800">
            {formatMessage({ id: 'config-sync.ConfigDiff.Title' })} {configName}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Grid.Root paddingBottom={4} style={{ textAlign: 'center' }}>
            <Grid.Item col={6} style={{ justifyContent: 'center' }}>
              <Typography variant="delta" style={commonHeadingStyle}>{formatMessage({ id: 'config-sync.ConfigDiff.SyncDirectory' })}
              </Typography>
              <ConfirmModal
                type="import"
                trigger={<Button title="Import config into DB for this file only">Import</Button>}
                onSubmit={(force) => dispatch(importAllConfig([configName], force, toggleNotification, formatMessage, post, get))}
              />
            </Grid.Item>
            <Grid.Item col={6} style={{ justifyContent: 'center' }}>
              <Typography variant="delta" style={commonHeadingStyle}>
                {formatMessage({ id: 'config-sync.ConfigDiff.Database' })}
              </Typography>
              <ConfirmModal
                type="export"
                trigger={<Button title="Export DB config for this file only">Export</Button>}
                onSubmit={() => dispatch(exportAllConfig([configName], toggleNotification, formatMessage, post, get))}
              />
            </Grid.Item>
          </Grid.Root>
          <Typography variant="pi">
            <ReactDiffViewer
              oldValue={JSON.stringify(oldValue, null, 2)}
              newValue={JSON.stringify(newValue, null, 2)}
              splitView
              compareMethod={DiffMethod.WORDS}
            />
          </Typography>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ConfigDiff;
