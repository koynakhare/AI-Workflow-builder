// NodeWrapper.js - Common UI for all node types

import { Handle, Position } from 'reactflow';
import { renderField } from './fields';

const nodeStyle = { width: 200, height: 80, border: '1px solid black' };

export const NodeWrapper = ({ title, handles = [], fields = [], children }) => {
  const leftHandles = handles?.filter((h) => h.position === Position.Left);
  const rightHandles = handles?.filter((h) => h.position === Position.Right);

  return (
    <div style={nodeStyle}>
      {leftHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={h.style}
        />
      ))}
      <div>
        <span>{title}</span>
      </div>
      {children}
      {fields?.length > 0 && (
        <div>
          {fields?.map(({ type, props }, index) => (
            <div key={`field-${index}`}>
              {renderField(type, props)}
            </div>
          ))}
        </div>
      )}
      {rightHandles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          style={h.style}
        />
      ))}
    </div>
  );
};
