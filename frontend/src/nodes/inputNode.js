// inputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const fields = [
    {
      type: 'text',
      props: {
        label: 'Name',
        value: currName,
        onChange: (e) => setCurrName(e.target.value),
      },
    },
    {
      type: 'select',
      props: {
        label: 'Type',
        value: inputType,
        onChange: (e) => setInputType(e.target.value),
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
      },
    },
  ];

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-value` },
  ];

  return (
    <NodeWrapper
      title="Input"
      handles={handles}
      fields={fields}
    />
  );
};
