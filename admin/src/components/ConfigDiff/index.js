import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

import { ModalLayout, ModalFooter, ModalBody, ModalHeader } from '@strapi/parts/ModalLayout';
import { ButtonText } from '@strapi/parts/Text';
import { Button } from '@strapi/parts/Button';

const ConfigDiff = ({ isOpen, onClose, onToggle, oldValue, newValue, configName }) => {
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
      <ModalFooter>
        <section style={{ alignItems: 'center' }}>

        </section>
      </ModalFooter>
    </ModalLayout>
  );
}

export default ConfigDiff;
