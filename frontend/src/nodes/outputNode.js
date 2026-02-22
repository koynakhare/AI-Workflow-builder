import { useState } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName ?? id?.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType ?? 'Text');

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
        value: outputType,
        onChange: (e) => setOutputType(e?.target?.value ?? ''),
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'Image' },
        ],
      },
    },
  ];

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-value` },
  ];

  return (
    <NodeWrapper
      id={id}
      title="Output"
      nodeType="customOutput"
      handles={handles}
      fields={fields}
    />
  );
};
