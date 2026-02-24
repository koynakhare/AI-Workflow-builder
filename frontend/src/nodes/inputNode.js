import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';
import { useNodeActions } from '../store/hooks/useNodes';
import { getNodeInternalName } from './textNodeUtils';

export const InputNode = ({ id, data }) => {
  const { updateNodeField } = useNodeActions();
  const defaultName = getNodeInternalName(id, 'customInput');
  const [currName, setCurrName] = useState(data?.inputName ?? defaultName);
  const [inputType, setInputType] = useState(data?.inputType ?? 'Text');

  useEffect(() => {
    if (data?.inputName === undefined || data?.inputName === null) {
      updateNodeField(id, 'inputName', defaultName);
    }
  }, [id, defaultName, data?.inputName, updateNodeField]);

  const handleNameChange = (e) => {
    const value = e?.target?.value ?? '';
    setCurrName(value);
    updateNodeField(id, 'inputName', value);
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
        value: inputType,
        onChange: (e) => {
          const value = e?.target?.value ?? 'Text';
          setInputType(value);
          updateNodeField(id, 'inputType', value);
        },
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
      id={id}
      title="Input"
      nodeType="customInput"
      handles={handles}
      fields={fields}
    />
  );
};
