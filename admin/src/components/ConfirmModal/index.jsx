import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  Dialog,
  Flex,
  Typography,
  Button,
  Checkbox,
  Divider,
  Box,
  Field,
} from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';

const ConfirmModal = ({ onClose, onSubmit, type, trigger }) => {
  const soft = useSelector((state) => state.getIn(['config', 'appEnv', 'config', 'soft'], false));
  const [force, setForce] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{formatMessage({ id: "config-sync.popUpWarning.Confirmation" })}</Dialog.Header>
        <Dialog.Body>
          <WarningCircle fill="danger600" width="32px" height="32px" />
          <Flex size={2}>
            <Flex justifyContent="center">
              <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
                {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1` })}<br />
                {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2` })}
              </Typography>
            </Flex>
          </Flex>
          {(soft && type === 'import') && (
            <Box width="100%">
              <Divider marginTop={4} />
              <Box paddingTop={6}>
                <Field.Root hint="Check this to ignore the soft setting.">
                  <Checkbox
                    onValueChange={(value) => setForce(value)}
                    value={force}
                    name="force"
                  >
                    {formatMessage({ id: 'config-sync.popUpWarning.force' })}
                  </Checkbox>
                  <Field.Hint />
                </Field.Root>
              </Box>
            </Box>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button fullWidth variant="tertiary">
              {formatMessage({ id: 'config-sync.popUpWarning.button.cancel' })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                onSubmit(force);
              }}
            >
              {formatMessage({ id: `config-sync.popUpWarning.button.${type}` })}
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmModal;
