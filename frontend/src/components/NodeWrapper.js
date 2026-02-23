import { useState, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { filter } from 'lodash';
import { useStore } from '../store';
import { renderField } from './fields';

const NODE_TYPE_CLASS = {
  customInput: 'input',
  llm: 'llm',
  customOutput: 'output',
  text: 'text',
};

const HOLD_DURATION_MS = 500;

export const NodeWrapper = ({
  title,
  handles = [],
  fields = [],
  children,
  width,
  height,
  nodeType = 'text',
  id = 'node',
}) => {
  const deleteNode = useStore((s) => s?.deleteNode);
  const [showDelete, setShowDelete] = useState(false);
  const holdTimerRef = useRef(null);

  const leftHandles = filter(handles, (h) => h?.position === Position.Left) ?? [];
  const rightHandles = filter(handles, (h) => h?.position === Position.Right) ?? [];
  const leftHandlesToRender =
    leftHandles?.length > 0
      ? leftHandles
      : nodeType === 'customInput'
      ? []
      : [{ type: 'target', position: Position.Left, id: `${id}-target` }];
  const rightHandlesToRender =
    rightHandles?.length > 0
      ? rightHandles
      : nodeType === 'customOutput'
      ? []
      : [{ type: 'source', position: Position.Right, id: `${id}-source` }];
  const nodeModifier = NODE_TYPE_CLASS[nodeType] ?? 'default';

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef?.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => setShowDelete(true), HOLD_DURATION_MS);
  }, [clearHoldTimer]);

  const handleMouseUp = useCallback(() => clearHoldTimer(), [clearHoldTimer]);
  const handleMouseLeave = useCallback(() => {
    clearHoldTimer();
    setShowDelete(false);
  }, [clearHoldTimer]);

  const handleDelete = useCallback(
    (e) => {
      e?.stopPropagation?.();
      deleteNode?.(id);
      setShowDelete(false);
    },
    [id, deleteNode]
  );

  return (
    <div
      className="node-wrapper"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`node node--${nodeModifier}`}>
        {leftHandlesToRender?.map((h) => (
          <Handle
            key={h?.id}
            type={h?.type}
            position={h?.position}
            id={h?.id}
            className="pipeline-handle"
          />
        ))}
        <div className="node__header">
          <span>{title}</span>
        </div>
        <div className="node__body">
          {children}
          {fields?.length > 0 && (
            <div className="node__fields">
              {fields?.map(({ type, props }, index) => (
                <div key={`field-${index}`} className="node__field">
                  {renderField(type, props)}
                </div>
              ))}
            </div>
          )}
        </div>
        {rightHandlesToRender?.map((h) => (
          <Handle
            key={h?.id}
            type={h?.type}
            position={h?.position}
            id={h?.id}
            className="pipeline-handle"
          />
        ))}
      </div>
      {showDelete && (
        <button
          type="button"
          className="node__delete"
          onClick={handleDelete}
          aria-label="Remove node"
        >
          ✕
        </button>
      )}
    </div>
  );
};
