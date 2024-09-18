import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useIntl } from 'react-intl';

import {
  Modal,
  Grid,
  Typography,
} from '@strapi/design-system';

const ConfigDiff = ({ isOpen, onClose, oldValue, newValue, configName }) => {
  const { formatMessage } = useIntl();
  if (!isOpen) return null;

  return (
    <Modal.Root
      onClose={onClose}
      labelledBy="title"
    >
      <Modal.Header>
        <Typography variant="omega" fontWeight="bold" textColor="neutral800">
          {formatMessage({ id: 'config-sync.ConfigDiff.Title' })} {configName}
        </Typography>
      </Modal.Header>
      <Modal.Body>
        <Grid.Root paddingBottom={4} style={{ textAlign: 'center' }}>
          <Grid.Item col={6}>
            <Typography variant="delta">{formatMessage({ id: 'config-sync.ConfigDiff.SyncDirectory' })}</Typography>
          </Grid.Item>
          <Grid.Item col={6}>
            <Typography variant="delta">{formatMessage({ id: 'config-sync.ConfigDiff.Database' })}</Typography>
          </Grid.Item>
        </Grid.Root>
        <ReactDiffViewer
          oldValue={JSON.stringify(oldValue, null, 2)}
          newValue={JSON.stringify(newValue, null, 2)}
          splitView
          compareMethod={DiffMethod.WORDS}
        />
      </Modal.Body>
    </Modal.Root>
  );
};

export default ConfigDiff;
