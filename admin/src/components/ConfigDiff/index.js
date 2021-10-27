import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

import { ModalLayout, ModalBody, ModalHeader } from '@strapi/design-system/ModalLayout';
import { ButtonText } from '@strapi/design-system/Text';

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
        <section style={{ marginTop: 20 }}>
          <ReactDiffViewer
            oldValue={JSON.stringify(oldValue, null, 2)}
            newValue={JSON.stringify(newValue, null, 2)}
            splitView
            compareMethod={DiffMethod.WORDS}
          />
        </section>
      </ModalBody>
    </ModalLayout>
  );
};

export default ConfigDiff;
