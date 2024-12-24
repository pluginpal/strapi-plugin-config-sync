import React from 'react';
import RDV, { DiffMethod } from 'react-diff-viewer-continued';
import { useIntl } from 'react-intl';

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
  Modal,
  Grid,
  Typography,
} from '@strapi/design-system';

const ConfigDiff = ({ oldValue, newValue, configName, trigger }) => {
  const { formatMessage } = useIntl();

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
            <Grid.Item col={6}>
              <Typography variant="delta" style={{ width: '100%' }}>{formatMessage({ id: 'config-sync.ConfigDiff.SyncDirectory' })}</Typography>
            </Grid.Item>
            <Grid.Item col={6}>
              <Typography variant="delta" style={{ width: '100%' }}>{formatMessage({ id: 'config-sync.ConfigDiff.Database' })}</Typography>
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
