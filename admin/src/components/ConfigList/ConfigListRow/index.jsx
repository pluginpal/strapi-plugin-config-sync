import React from 'react';
import { Tr, Td, Checkbox, Typography, Box } from '@strapi/design-system';

const CustomRow = ({ row, checked, updateValue, ...props }) => {
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
      {...props}
      onClick={(e) => {
        if (e.target.type !== 'checkbox') {
          onClick(configType, configName);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <Td>
        <Checkbox
          aria-label={`Select ${configName}`}
          checked={checked}
          onCheckedChange={updateValue}
        />
      </Td>
      <Td onClick={(e) => props.onClick(e)}>
        <Typography variant="omega">{configName}</Typography>
      </Td>
      <Td onClick={(e) => props.onClick(e)}>
        <Typography variant="omega">{configType}</Typography>
      </Td>
      <Td onClick={(e) => props.onClick(e)}>
        <Typography variant="omega" style={stateStyle(state)}>{state}</Typography>
      </Td>
    </Tr>
  );
};

export default CustomRow;
