import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { get } from 'lodash';
import { InputNode } from '../nodes/inputNode';
import { LLMNode } from '../nodes/llmNode';
import { OutputNode } from '../nodes/outputNode';
import { TextNode } from '../nodes/textNode';
import { ColoredEdge } from './ColoredEdge';

import 'reactflow/dist/style.css';

const GRID_SIZE = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};
const edgeTypes = { colored: ColoredEdge };
const NODE_COLORS = {
  customInput: '#3b82f6',
  llm: '#8b5cf6',
  customOutput: '#10b981',
  text: '#f59e0b',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: `${type}` });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper?.current?.getBoundingClientRect();
      const appData = event?.dataTransfer?.getData('application/reactflow');
      if (!appData || !bounds || !reactFlowInstance) return;

      const { nodeType: type } = JSON.parse(appData) ?? {};
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const nodeColor = (node) => get(NODE_COLORS, node?.type, '#6b7280');

  return (
    <div ref={reactFlowWrapper} className="canvas__container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode="loose"
        connectionLineStyle={{ stroke: '#6c63ff', strokeWidth: 2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#6c63ff', strokeWidth: 2 },
        }}
        proOptions={proOptions}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        connectionLineType="smoothstep"
        fitView
        minZoom={0.25}
        maxZoom={1}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        panOnDrag
        zoomOnScroll
        edgesSelectable
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="#2d2d44" gap={GRID_SIZE} size={1} />
        <Controls />
        <MiniMap nodeColor={nodeColor} maskColor="rgba(26, 26, 46, 0.8)" />
      </ReactFlow>
    </div>
  );
};
