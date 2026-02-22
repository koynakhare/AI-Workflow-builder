// textNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { NodeWrapper } from '../components/NodeWrapper';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const fields = [
    {
      type: 'text',
      props: {
        label: 'Text',
        value: currText,
        onChange: (e) => setCurrText(e.target.value),
      },
    },
  ];

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-output` },
  ];

  return (
    <NodeWrapper
      title="Text"
      handles={handles}
      fields={fields}
    />
  );
};
