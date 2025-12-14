import { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import ResizableWrapper from "../ui/ResizableWrapper";

export default function ImageNode({ id, data, style }) {
  const [src, setSrc] = useState(data.src || "");
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (data.src !== src) setSrc(data.src);
  }, [data.src]);

  const update = (newSrc) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, src: newSrc } } : n
      )
    );
  };

  const uploadImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSrc(url);
    update(url);
  };

  return (
    <ResizableWrapper id={id}>
      {!src ? (
        <label className="p-3 cursor-pointer text-blue-500">
          Upload Image
          <input className="hidden" type="file" onChange={uploadImg} />
        </label>
      ) : (
        <img src={src} className="w-full h-full object-contain rounded" />
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </ResizableWrapper>
  );
}
