import { useCallback } from 'react';
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

const DeleteIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

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

  const handleDelete = useCallback(
    (e) => {
      e?.stopPropagation?.();
      deleteNode?.(id);
    },
    [id, deleteNode]
  );

  return (
    <div className="node-wrapper">
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
          <button
            type="button"
            className="node__delete"
            onClick={handleDelete}
            aria-label="Remove node"
          >
            <DeleteIcon />
          </button>
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
    </div>
  );
};
