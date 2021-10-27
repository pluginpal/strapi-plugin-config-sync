import React from 'react';

import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Flex } from '@strapi/design-system/Flex';
import { Text } from '@strapi/design-system/Text';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import AlertWarningIcon from '@strapi/icons/AlertWarningIcon';

import getTrad from '../../helpers/getTrad';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
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
            <Text id="confirm-description">{getTrad(`popUpWarning.warning.${type}`)}</Text>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={(
          <Button
            onClick={() => {
              onClose();
              onSubmit();
            }}
            variant="tertiary"
          >
            Cancel
          </Button>
        )}
        endAction={(
          <Button variant="danger-light" startIcon={<DeleteIcon />}>
            {getTrad(`popUpWarning.button.${type}`)}
          </Button>
        )} />
    </Dialog>
  );
};

export default ConfirmModal;
