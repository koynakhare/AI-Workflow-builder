import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './components/ui';
import { SubmitButton } from './components/buttons/submit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div className="app">
    <ToastContainer position="top-right" autoClose={3000} />
    <PipelineToolbar />
    <PipelineUI />
    <SubmitButton />
  </div>
);

export default App;
