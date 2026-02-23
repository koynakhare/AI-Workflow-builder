import { useState } from 'react';
import { useStore } from '../store';
import { get } from 'lodash';

const TYPE_CONFIG = {
  customInput: { buttonClass: 'toolbar__button--input', accentClass: 'toolbar__button-accent--input' },
  llm: { buttonClass: 'toolbar__button--llm', accentClass: 'toolbar__button-accent--llm' },
  customOutput: { buttonClass: 'toolbar__button--output', accentClass: 'toolbar__button-accent--output' },
  text: { buttonClass: 'toolbar__button--text', accentClass: 'toolbar__button-accent--text' },
};

export const DraggableNode = ({ type, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const getNodeID = useStore((s) => s?.getNodeID);
  const addNode = useStore((s) => s?.addNode);
  const config = get(TYPE_CONFIG, type, { buttonClass: '', accentClass: '' });

  const onDragStart = (event) => {
    setIsDragging(true);
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => setIsDragging(false);

  const handleClick = () => {
    const nodeId = getNodeID?.(type);
    if (!nodeId || !addNode) return;
    const position = { x: 0, y: 0 };
    addNode({
      id: nodeId,
      type,
      position,
      data: { id: nodeId, nodeType: `${type}` },
    });
  };

  return (
    <div
      className={`toolbar__button ${config.buttonClass} ${isDragging ? 'toolbar__button--dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <span className={`toolbar__button-accent ${config.accentClass}`} />
      <span>{label}</span>
    </div>
  );
};
