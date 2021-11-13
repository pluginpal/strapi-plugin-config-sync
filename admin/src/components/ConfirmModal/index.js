import React from 'react';
import { useIntl } from 'react-intl';

import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Flex } from '@strapi/design-system/Flex';
import { Text } from '@strapi/design-system/Text';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import AlertWarningIcon from '@strapi/icons/AlertWarningIcon';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title="Confirmation"
      isOpen={isOpen}
    >
      <DialogBody icon={<AlertWarningIcon />}>
        <Stack size={2}>
          <Flex justifyContent="center">
            <Text id="confirm-description" style={{ textAlign: 'center' }}>
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1` })}<br />
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2` })}
            </Text>
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
