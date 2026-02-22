import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';
import { useNodeActions } from '../store/hooks/useNodes';
import { getNodeInternalName } from './textNodeUtils';

export const OutputNode = ({ id, data }) => {
  const { updateNodeField } = useNodeActions();
  const defaultName = getNodeInternalName(id, 'customOutput');
  const [currName, setCurrName] = useState(data?.outputName ?? defaultName);
  const [outputType, setOutputType] = useState(data?.outputType ?? 'Text');

  useEffect(() => {
    if (data?.outputName === undefined || data?.outputName === null) {
      updateNodeField(id, 'outputName', defaultName);
    }
  }, [id, defaultName, data?.outputName, updateNodeField]);

  const handleNameChange = (e) => {
    const value = e?.target?.value ?? '';
    setCurrName(value);
    updateNodeField(id, 'outputName', value);
  };

  const fields = [
    {
      type: 'text',
      props: {
        label: 'Name',
        value: currName,
        onChange: handleNameChange,
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
