import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '@strapi/design-system/Button';
import { Map } from 'immutable';

import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig } from '../../state/actions/Config';

const ActionButtons = () => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const partialDiff = useSelector((state) => state.getIn(['config', 'partialDiff'], Map({}))).toJS();

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
      <Button disabled={isEmpty(partialDiff)} onClick={() => openModal('import')}>Import</Button>
      <Button disabled={isEmpty(partialDiff)} onClick={() => openModal('export')}>Export</Button>
      {!isEmpty(partialDiff) && (
        <h4 style={{ display: 'inline' }}>{Object.keys(partialDiff).length} {Object.keys(partialDiff).length === 1 ? "config change" : "config changes"}</h4>
      )}
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        type={actionType}
        onSubmit={() => actionType === 'import' ? dispatch(importAllConfig(partialDiff)) : dispatch(exportAllConfig(partialDiff))}
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
