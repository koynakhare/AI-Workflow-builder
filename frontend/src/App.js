import { useState } from 'react';
import { useStore } from './store';
import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './components/ui';
import { SubmitButton, submitPipeline } from './components/buttons/submit';
import { PipelineResultModal } from './components/PipelineResultModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    const result = await submitPipeline(nodes, edges);
    if (result) {
      setPipelineResult(result);
      setModalOpen(true);
    } 
  };

  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={1000} />
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton onClick={handleSubmit} />
      <PipelineResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={pipelineResult}
      />
    </div>
  );
};

export default App;
