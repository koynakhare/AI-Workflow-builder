import { postApi } from '../../api/apiService';

const API_BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

export const submitPipeline = async (nodes, edges) => {
  try {
    const data = await postApi(`${API_BASE}/pipelines/parse`, { nodes, edges });
    return data;
  } catch {
    return null;
  }
};

const SubmitButton = ({ onClick }) => (
  <button type="button" className="button--submit" onClick={onClick}>
    Submit
  </button>
);

export { SubmitButton };
