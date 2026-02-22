import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => (
  <div className="toolbar">
    <div className="toolbar__buttons">
      <DraggableNode type="customInput" label="Input" />
      <DraggableNode type="llm" label="LLM" />
      <DraggableNode type="customOutput" label="Output" />
      <DraggableNode type="text" label="Text" />
    </div>
  </div>
);
