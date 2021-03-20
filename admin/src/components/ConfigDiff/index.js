import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { AttributeIcon } from '@buffetjs/core';
import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
} from 'strapi-helper-plugin';

const ConfigDiff = ({ isOpen, onClose, onToggle, oldValue, newValue, configName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClosed={onClose}
      onToggle={onToggle}
    >
      <HeaderModal>
        <section style={{ alignItems: 'center' }}>
          <AttributeIcon type='enum' />
          <HeaderModalTitle style={{ marginLeft: 15 }}>Config changes for {configName}</HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody style={{
        paddingTop: '0.5rem', 
        paddingBottom: '3rem'
      }}>
        <div className="container-fluid">
          <section style={{ marginTop: 20 }}>
            <ReactDiffViewer
              oldValue={JSON.stringify(oldValue, null, 2)}
              newValue={JSON.stringify(newValue, null, 2)}
              splitView={true}
              compareMethod={DiffMethod.WORDS}
            />
          </section>
        </div>
      </ModalBody>
      <ModalFooter>
        <section style={{ alignItems: 'center' }}>
          
        </section>
      </ModalFooter>
    </Modal>
  );
}
 
export default ConfigDiff;