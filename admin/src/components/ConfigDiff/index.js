import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  Grid,
  GridItem,
  Typography,
} from '@strapi/design-system';

const ConfigDiff = ({ isOpen, onClose, oldValue, newValue, configName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalLayout
      onClose={onClose}
      labelledBy="title"
    >
      <ModalHeader>
        <Typography variant="omega" fontWeight="bold" textColor="neutral800">
          Config changes for {configName}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Grid paddingBottom={4} style={{ textAlign: 'center' }}>
          <GridItem col={6}>
            <Typography variant="delta">Sync directory</Typography>
          </GridItem>
          <GridItem col={6}>
            <Typography variant="delta">Database</Typography>
          </GridItem>
        </Grid>
        <ReactDiffViewer
          oldValue={JSON.stringify(oldValue, null, 2)}
          newValue={JSON.stringify(newValue, null, 2)}
          splitView
          compareMethod={DiffMethod.WORDS}
        />
      </ModalBody>
    </ModalLayout>
  );
};

export default ConfigDiff;
