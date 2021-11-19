import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

import { ModalLayout, ModalBody, ModalHeader } from '@strapi/design-system/ModalLayout';
import { ButtonText } from '@strapi/design-system/Text';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';

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
        <ButtonText textColor="neutral800" as="h2" id="title">
          Config changes for {configName}
        </ButtonText>
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
