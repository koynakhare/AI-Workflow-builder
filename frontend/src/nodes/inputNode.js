import { useState } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName ?? id?.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType ?? 'Text');

  const fields = [
    {
      type: 'text',
      props: {
        label: 'Name',
        value: currName,
        onChange: (e) => setCurrName(e?.target?.value ?? ''),
      },
    },
    {
      type: 'select',
      props: {
        label: 'Type',
        value: inputType,
        onChange: (e) => setInputType(e?.target?.value ?? ''),
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
      },
    },
  ];

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-target` },
    { type: 'source', position: Position.Right, id: `${id}-value` },
  ];

  return (
    <NodeWrapper
      id={id}
      title="Input"
      nodeType="customInput"
      handles={handles}
      fields={fields}
    />
  );
};
