import { Handle, Position } from 'reactflow';
import { filter } from 'lodash';
import { renderField } from './fields';

const NODE_TYPE_CLASS = {
  customInput: 'input',
  llm: 'llm',
  customOutput: 'output',
  text: 'text',
};

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
  const leftHandles = filter(handles, (h) => h?.position === Position.Left) ?? [];
  const rightHandles = filter(handles, (h) => h?.position === Position.Right) ?? [];
  const leftHandlesToRender = leftHandles?.length > 0
    ? leftHandles
    : [{ type: 'target', position: Position.Left, id: `${id}-target` }];
  const rightHandlesToRender = rightHandles?.length > 0
    ? rightHandles
    : [{ type: 'source', position: Position.Right, id: `${id}-source` }];
  const nodeModifier = NODE_TYPE_CLASS[nodeType] ?? 'default';

  return (
    <div className={`node node--${nodeModifier}`}>
      {leftHandlesToRender?.map((h) => (
        <Handle
          key={h?.id}
          type={h?.type}
          position={h?.position}
          id={h?.id}
          className="pipeline-handle"
          style={h?.style}
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
          style={h?.style}
        />
      ))}
    </div>
  );
};
