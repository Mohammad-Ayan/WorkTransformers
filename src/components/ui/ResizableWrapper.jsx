import { useRef } from "react";
import { useReactFlow } from "reactflow";

export default function ResizableWrapper({
  id,
  children,
  minWidth = 40,
  minHeight = 40,
}) {
  const isResizing = useRef(false);
  const { getNodes, setNodes } = useReactFlow();

  const startResize = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const node = getNodes().find((n) => n.id === id);
    if (!node) return;

    const startWidth = parseFloat(node.style?.width || 120);
    const startHeight = parseFloat(node.style?.height || 80);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = node.position.x;
    const startPosY = node.position.y;

    isResizing.current = true;

    document.body.style.cursor = getCursor(direction);
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      if (!isResizing.current) return;

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let width = startWidth;
      let height = startHeight;
      let x = startPosX;
      let y = startPosY;

      if (direction.includes("right")) width = Math.max(minWidth, startWidth + dx);
      if (direction.includes("bottom")) height = Math.max(minHeight, startHeight + dy);

      if (direction.includes("left")) {
        const w = Math.max(minWidth, startWidth - dx);
        x = startPosX + (startWidth - w);
        width = w;
      }

      if (direction.includes("top")) {
        const h = Math.max(minHeight, startHeight - dy);
        y = startPosY + (startHeight - h);
        height = h;
      }

      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                position: { x, y },
                style: { ...n.style, width, height },
              }
            : n
        )
      );
    };

    const stop = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", stop);
  };

  const getCursor = (dir) =>
    ({
      "top": "ns-resize",
      "bottom": "ns-resize",
      "left": "ew-resize",
      "right": "ew-resize",
      "top-left": "nwse-resize",
      "top-right": "nesw-resize",
      "bottom-left": "nesw-resize",
      "bottom-right": "nwse-resize",
    }[dir]);

  const handles = [
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left",
  ];

  return (
    <div className="relative w-full h-full group">
      {children}

      {handles.map((dir) => (
        <div
          key={dir}
          onMouseDown={(e) => startResize(e, dir)}
          className="absolute opacity-0 group-hover:opacity-100 transition-all z-[200]"
          style={{
            cursor: getCursor(dir),
            width: dir.includes("-") ? 10 : dir === "left" || dir === "right" ? 8 : 40,
            height: dir.includes("-") ? 10 : dir === "top" || dir === "bottom" ? 8 : 40,
            background: dir.includes("-") ? "#3b82f6" : "rgba(59,130,246,0.5)",
            borderRadius: dir.includes("-") ? "50%" : "4px",
            border: "2px solid white",
            top:
              dir.includes("top")
                ? "-5px"
                : dir.includes("bottom")
                ? "auto"
                : "50%",
            bottom: dir.includes("bottom") ? "-5px" : "auto",
            left:
              dir.includes("left")
                ? "-5px"
                : dir.includes("right")
                ? "auto"
                : "50%",
            right: dir.includes("right") ? "-5px" : "auto",
            transform:
              dir === "top" || dir === "bottom"
                ? "translateX(-50%)"
                : dir === "left" || dir === "right"
                ? "translateY(-50%)"
                : "none",
          }}
        />
      ))}
    </div>
  );

}
