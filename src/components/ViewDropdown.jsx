import React from 'react';
import './ViewDropdown.css';

function ViewDropdown({ value, onChange }) {
  return (
    <div className="view-dropdown">
      <label className="view-dropdown__label">Vista</label>
      <div className="view-dropdown__select-wrap">
        <select
          className="view-dropdown__select"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="2d">2D — Ilustración</option>
          <option value="3d">3D — Volumétrica</option>
        </select>
        <span className="view-dropdown__arrow">▾</span>
      </div>
    </div>
  );
}

export default ViewDropdown;
