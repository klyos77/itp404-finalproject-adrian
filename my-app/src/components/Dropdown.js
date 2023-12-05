import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = ({ options, selectedValue, onChange }) => {
  return (
    <select value={selectedValue} onChange={onChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.icon && <FontAwesomeIcon icon={option.icon} />} {option.name}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;