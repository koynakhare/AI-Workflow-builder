import { getSmoothStepPath } from 'reactflow';

const EDGE_COLOR = '#6c63ff';

const ColoredEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const markerId = `arrow-${id ?? 'edge'}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={EDGE_COLOR} />
        </marker>
      </defs>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={EDGE_COLOR}
        strokeWidth={2}
        markerEnd={`url(#${markerId})`}
        className="edge__path"
      />
    </>
  );
};

export { ColoredEdge };
