import { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import ResizableWrapper from "../ui/ResizableWrapper";

export default function TextNode({ id, data, style }) {
  const [value, setValue] = useState(data.text || "");
  const { setNodes } = useReactFlow();

  useEffect(() => {
    setValue(data.text || "");
  }, [data.text]);

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
          className="w-full h-full p-2 resize-none outline-none bg-gray-50 dark:bg-gray-800"
          value={value}
          onChange={(e) => update(e.target.value)}
        />
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </ResizableWrapper>
  );
}
