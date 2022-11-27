import React from 'react';
import { useIntl } from 'react-intl';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Stack,
  Button,
} from '@strapi/design-system';
import { ExclamationMarkCircle } from '@strapi/icons';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title="Confirmation"
      isOpen={isOpen}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack size={2}>
          <Flex justifyContent="center">
            <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1` })}<br />
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2` })}
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={(
          <Button
            onClick={() => {
              onClose();
            }}
            variant="tertiary"
          >
            {formatMessage({ id: 'config-sync.popUpWarning.button.cancel' })}
          </Button>
        )}
        endAction={(
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              onSubmit();
            }}
          >
            {formatMessage({ id: `config-sync.popUpWarning.button.${type}` })}
          </Button>
        )} />
    </Dialog>
  );
};

export default ConfirmModal;
