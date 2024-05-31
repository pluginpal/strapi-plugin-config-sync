import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Button,
  Checkbox,
  Divider,
  Box,
} from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  const soft = useSelector((state) => state.getIn(['config', 'appEnv', 'config', 'soft'], false));
  const [force, setForce] = useState(false);
  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title={formatMessage({ id: "config-sync.popUpWarning.Confirmation" })}
      isOpen={isOpen}
    >
      <DialogBody icon={<WarningCircle />}>
        <Flex size={2}>
          <Flex justifyContent="center">
            <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1` })}<br />
              {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2` })}
            </Typography>
          </Flex>
        </Flex>
      </DialogBody>
      {(soft && type === 'import') && (
        <React.Fragment>
          <Divider />
          <Box padding={4}>
            <Checkbox
              onValueChange={(value) => setForce(value)}
              value={force}
              name="force"
              hint="Check this to ignore the soft setting."
            >
              {formatMessage({ id: 'config-sync.popUpWarning.force' })}
            </Checkbox>
          </Box>
        </React.Fragment>
      )}
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
              onSubmit(force);
            }}
          >
            {formatMessage({ id: `config-sync.popUpWarning.button.${type}` })}
          </Button>
        )} />
    </Dialog>
  );
};

export default ConfirmModal;
