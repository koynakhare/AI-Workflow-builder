const PipelineResultModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
  const { num_nodes, num_edges, is_dag } = data ?? {};
  return (
    <div className="pipeline-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pipeline-modal__card" onClick={(e) => e?.stopPropagation?.()}>
        <header className="pipeline-modal__header">
          <h2 className="pipeline-modal__title">Pipeline Analysis</h2>
          <p className="pipeline-modal__subtitle">Here&apos;s a summary of your pipeline</p>
        </header>
        <div className="pipeline-modal__stats">
          <div className="pipeline-modal__stat">
            <span className="pipeline-modal__stat-value">{num_nodes ?? 0}</span>
            <span className="pipeline-modal__stat-label">Nodes</span>
          </div>
          <div className="pipeline-modal__stat">
            <span className="pipeline-modal__stat-value">{num_edges ?? 0}</span>
            <span className="pipeline-modal__stat-label">Edges</span>
          </div>
          <div className="pipeline-modal__stat">
            <span
              className={`pipeline-modal__stat-value ${is_dag === true ? 'pipeline-modal__stat-value--valid' : is_dag === false ? 'pipeline-modal__stat-value--invalid' : ''}`}
            >
              {is_dag ? '✓' : '✗'}
            </span>
            <span className="pipeline-modal__stat-label">Valid DAG</span>
          </div>
        </div>
        <div
          className={`pipeline-modal__banner ${is_dag ? 'pipeline-modal__banner--valid' : 'pipeline-modal__banner--invalid'}`}
        >
          {is_dag
            ? '✅ This pipeline forms a valid Directed Acyclic Graph'
            : '❌ This pipeline contains a cycle — not a valid DAG'}
        </div>
        <button type="button" className="pipeline-modal__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export { PipelineResultModal };
