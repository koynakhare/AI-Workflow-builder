import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';

export const LLMNode = ({ id }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: `${100 / 3}%` } },
    { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: `${200 / 3}%` } },
    { type: 'source', position: Position.Right, id: `${id}-response` },
  ];

  return (
    <NodeWrapper
      id={id}
      title="LLM"
      nodeType="llm"
      handles={handles}
      fields={[]}
    >
      <div>
        <span>This is a LLM.</span>
      </div>
    </NodeWrapper>
  );
};
