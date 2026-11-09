import React, { useEffect, useState } from 'react';
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

const ConfigDiff = ({ oldValue, newValue, error, configName, open, onOpenChange }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { post, get } = getFetchClient();
  const [syncError, setSyncError] = useState('');
  useEffect(() => {
    setSyncError('');
  }, [configName, open]);

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Typography variant="omega" fontWeight="bold" textColor="neutral800">
            {formatMessage({ id: 'config-sync.ConfigDiff.Title' })} {configName}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          {syncError && (
            <Typography as="p" textColor="danger600" role="alert">
              {syncError}
            </Typography>
          )}
          {error ? (
            <Typography textColor="danger600" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {error}
            </Typography>
          ) : (
            <>
              <Grid.Root paddingBottom={4} style={{ textAlign: 'center' }}>
                <Grid.Item col={6}>
                  <Typography variant="delta" style={{ width: '100%' }}>
                    {formatMessage({ id: 'config-sync.ConfigDiff.SyncDirectory' })}
                  </Typography>
                </Grid.Item>
                <Grid.Item col={6}>
                  <Typography variant="delta" style={{ width: '100%' }}>
                    {formatMessage({ id: 'config-sync.ConfigDiff.Database' })}
                  </Typography>
                </Grid.Item>
              </Grid.Root>
              <Typography variant="pi">
                <ReactDiffViewer
                  oldValue={JSON.stringify(oldValue, null, 2) ?? ''}
                  newValue={JSON.stringify(newValue, null, 2) ?? ''}
                  splitView
                  compareMethod={DiffMethod.WORDS}
                />
              </Typography>
            </>
          )}
        </Modal.Body>
        <Modal.Footer justifyContent="flex-end" gap={2}>
          <ConfirmModal
            type="import"
            trigger={(
              <Button title={formatMessage({ id: 'config-sync.ConfigDiff.ImportTitle' })}>
                {formatMessage({ id: 'config-sync.Buttons.Import' })}
              </Button>
            )}
            onSubmit={async (force) => {
              setSyncError('');
              const succeeded = await dispatch(importAllConfig([configName], force, toggleNotification, formatMessage, post, get, setSyncError));
              if (succeeded) onOpenChange(false, configName);
            }}
          />
          <ConfirmModal
            type="export"
            trigger={(
              <Button title={formatMessage({ id: 'config-sync.ConfigDiff.ExportTitle' })}>
                {formatMessage({ id: 'config-sync.Buttons.Export' })}
              </Button>
            )}
            onSubmit={async () => {
              setSyncError('');
              const succeeded = await dispatch(exportAllConfig([configName], toggleNotification, formatMessage, post, get, setSyncError));
              if (succeeded) onOpenChange(false, configName);
            }}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ConfigDiff;
