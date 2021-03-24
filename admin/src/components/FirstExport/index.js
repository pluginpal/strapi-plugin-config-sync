import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@buffetjs/core';
import { exportAllConfig } from '../../state/actions/Config';
import ConfirmModal from '../ConfirmModal';

const FirstExport = () => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      height: '300px',
     }}>
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        type={'export'}
        onSubmit={() =>  dispatch(exportAllConfig())}
      />
      <h3>Looks like this is your first time using config-sync for this project.</h3>
      <p>Make the initial export!</p>
      <Button color="primary" onClick={() => setModalIsOpen(true)}>Initial export</Button>
    </div>
  );
}
 
export default FirstExport;