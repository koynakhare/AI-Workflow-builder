import { postApi } from '../../api/apiService';

export const submitPipeline = async (nodes, edges) => {
  try {
    const data = await postApi(`pipelines/parse`, { nodes, edges });
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
