import React from 'react';
import styled from 'styled-components';

const CustomRow = ({ row }) => {
  const { config_name, config_type, state, onClick } = row;

  const stateStyle = (state) => {
    const style = {
      display: 'inline-flex',
      padding: '0 10px',
      borderRadius: '12px',
      height: '24px',
      alignItems: 'center',
      fontWeight: '500',
    };

    if (state === 'Only in DB') {
      style.backgroundColor = '#cbf2d7';
      style.color = '#1b522b';
    }

    if (state === 'Only in sync dir') {
      style.backgroundColor = '#f0cac7';
      style.color = '#3d302f';
    }

    if (state === 'Different') {
      style.backgroundColor = '#e8e6b7';
      style.color = '#4a4934';
    }

    return style;
  };

  return (
    <tr onClick={() => onClick(config_type, config_name)}>
      <td>
        <p>{config_name}</p>
      </td>
      <td>
        <p>{config_type}</p>
      </td>
      <td>
        <p style={stateStyle(state)}>{state}</p>
      </td>
    </tr>
  );
};

export default CustomRow;
