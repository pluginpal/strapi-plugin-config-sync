import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useIntl } from 'react-intl';

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
