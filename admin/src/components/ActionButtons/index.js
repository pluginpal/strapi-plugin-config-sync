import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '@strapi/design-system/Button';

import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig } from '../../state/actions/Config';

const ActionButtons = ({ diff }) => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const closeModal = () => {
    setActionType('');
    setModalIsOpen(false);
  };

  const openModal = (type) => {
    setActionType(type);
    setModalIsOpen(true);
  };

  return (
    <ActionButtonsStyling>
      <Button disabled={isEmpty(diff.diff)} onClick={() => openModal('import')}>Import</Button>
      <Button disabled={isEmpty(diff.diff)} onClick={() => openModal('export')}>Export</Button>
      {!isEmpty(diff.diff) && (
        <h4 style={{ display: 'inline' }}>{Object.keys(diff.diff).length} {Object.keys(diff.diff).length === 1 ? "config change" : "config changes"}</h4>
      )}
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        type={actionType}
        onSubmit={() => actionType === 'import' ? dispatch(importAllConfig()) : dispatch(exportAllConfig())}
      />
    </ActionButtonsStyling>
  );
};

const ActionButtonsStyling = styled.div`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: center;

  > button {
    margin-right: 10px;
  }
`;

export default ActionButtons;
