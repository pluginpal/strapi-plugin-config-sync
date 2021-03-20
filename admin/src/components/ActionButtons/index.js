import React from 'react';
import styled from 'styled-components';
import { Button } from '@buffetjs/core';

const ActionButtons = () => {
  return (
    <ActionButtonsStyling>
      <Button color="primary" label="Import"/>
      <Button color="primary" label="Export"/>
    </ActionButtonsStyling>
  );
}

const ActionButtonsStyling = styled.div`
  padding: 10px 0 20px 0;

  > button {
    margin-right: 10px;
  }
`;
 
export default ActionButtons;