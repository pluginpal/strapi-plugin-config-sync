import React from 'react';
import { Tr, Td } from '@strapi/design-system/Table';

const CustomRow = ({ row }) => {
  const { configName, configType, state, onClick } = row;

  const stateStyle = (stateStr) => {
    const style = {
      display: 'inline-flex',
      padding: '0 10px',
      borderRadius: '12px',
      height: '24px',
      alignItems: 'center',
      fontWeight: '500',
    };

    if (stateStr === 'Only in DB') {
      style.backgroundColor = '#cbf2d7';
      style.color = '#1b522b';
    }

    if (stateStr === 'Only in sync dir') {
      style.backgroundColor = '#f0cac7';
      style.color = '#3d302f';
    }

    if (stateStr === 'Different') {
      style.backgroundColor = '#e8e6b7';
      style.color = '#4a4934';
    }

    return style;
  };

  return (
    <Tr
      onClick={() => onClick(configType, configName)}
      style={{ cursor: 'pointer' }}
    >
      <Td>
        <p>{configName}</p>
      </Td>
      <Td>
        <p>{configType}</p>
      </Td>
      <Td>
        <p style={stateStyle(state)}>{state}</p>
      </Td>
    </Tr>
  );
};

export default CustomRow;
