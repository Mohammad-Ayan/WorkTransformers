import { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import ResizableWrapper from "../ui/ResizableWrapper";

export default function CommentNode({ id, data, style }) {
  const [value, setValue] = useState(data.text || "");
  const { setNodes } = useReactFlow();

  useEffect(() => setValue(data.text || ""), [data.text]);

  const update = (val) => {
    setValue(val);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, text: val } } : n
      )
    );
  };

  const outerStyle = {
    width: style?.width ?? "100%",
    height: style?.height ?? "100%",
  };

  return (
    <ResizableWrapper id={id}>
      <div style={outerStyle}>
        <textarea
          value={value}
          onChange={(e) => update(e.target.value)}
          className="w-full h-full bg-transparent resize-none outline-none p-2"
        />
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </ResizableWrapper>
  );
}
