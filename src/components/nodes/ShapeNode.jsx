import { Handle, Position, useReactFlow } from "reactflow";
import { useEffect } from "react";
import ResizableWrapper from "../ui/ResizableWrapper";

export default function ShapeNode({ id, data, style }) {
  const { setNodes } = useReactFlow();
  const shape = data.shape || "rectangle";

  // ensure shape stays inside node.data
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, shape } } : n
      )
    );
  }, [shape]);

  return (
    <ResizableWrapper id={id} minWidth={40} minHeight={40}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {shape === "rectangle" && <rect width="100" height="100" fill="#7c3aed" />}
        {shape === "ellipse" && <ellipse cx="50" cy="50" rx="50" ry="50" fill="#2563eb" />}
        {shape === "triangle" && <polygon points="50,0 100,100 0,100" fill="#ef4444" />}
        {shape === "line" && (
          <line x1="5" y1="50" x2="95" y2="50" stroke="#10b981" strokeWidth="6" />
        )}
        {shape === "star" && (
          <polygon
            points="50,5 61,38 95,38 67,58 77,92 50,72 23,92 33,58 5,38 39,38"
            fill="#fbbf24"
          />
        )}
      </svg>

      <Handle type="target" position={Position.Top} className="bg-transparent" />
      <Handle type="source" position={Position.Bottom} className="bg-transparent" />
    </ResizableWrapper>
  );
}
