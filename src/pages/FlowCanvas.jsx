import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import { Sparkles } from "lucide-react";

import TextNode from "../components/nodes/TextNode";
import ImageNode from "../components/nodes/ImageNode";
import CommentNode from "../components/nodes/CommentNode";
import ShapeNode from "../components/nodes/ShapeNode";
import QueryNode from "../components/nodes/QueryNode";
import Toolbar from "../components/ui/Toolbar";
import { useTheme } from "../context/ThemeContext";

const nodeTypes = {
  textNode: (props) => <TextNode {...props} />,
  commentNode: (props) => <CommentNode {...props} />,
  imageNode: (props) => <ImageNode {...props} />,
  shapeNode: (props) => <ShapeNode {...props} />,
  queryNode: (props) => <QueryNode {...props} />,
};


export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeTool, setActiveTool] = useState('select');
  const [nodeCounter, setNodeCounter] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const backgroundColor = theme === "dark" ? "#333" : "#ddd";
  const gridColor = theme === "dark" ? "#555" : "#ccc";
  const [showInstructions, setShowInstructions] = useState(true);




const addNode = useCallback((type, extraData = {}) => {
  const id = `${type}-${nodeCounter}`;
  const newNode = {
    id,
    type,
    position: { x: 250 + Math.random() * 300, y: 120 + Math.random() * 200 },
    data: {
      ...extraData,
      shape: extraData.shapeType || "rectangle",
    },
    style: { width: extraData.width || 140, height: extraData.height || 90 },
  };

  setNodes((nds) => [...nds, newNode]);
  setNodeCounter((n) => n + 1);
}, [nodeCounter, setNodes]);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Delete selected nodes/edges with Delete key
  // Delete selected nodes/edges with Delete key — but NOT while typing
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // 🔹 BACKSPACE → never delete node
      if (e.key === "Backspace") {
        if (isTyping) return; // typing → do nothing
        return; // NOT typing → still do nothing (Backspace won't delete node)
      }

      // 🔹 DELETE KEY → delete selected node ONLY when NOT typing
      if (e.key === "Delete") {
        if (isTyping) return;
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    };

    const hideInstructions = () => setShowInstructions(false);

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("mousedown", hideInstructions);

  

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNodes, setEdges]);



  console.log("FlowCanvas: passing setActiveTool =", setActiveTool);


  return (
    <div className="w-full h-screen bg-gray-200 dark:bg-[#0a0a0a] transition-colors duration-300">


      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnDrag={activeTool === 'pan'}
        selectionOnDrag={activeTool === 'select'}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#666' }
        }}
      >
        <Background
          gap={20}
          size={1}
          color={gridColor}
        />
        <Controls
          className="
         !bg-white dark:!bg-gray-900 
           !text-black dark:!text-white
              !border !border-gray-400 dark:!border-gray-700
              !rounded-lg shadow-md
              overflow-hidden
            "
          style={{
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />



      </ReactFlow>

      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onAddNode={addNode}
      />

      <button
        onClick={toggleTheme}
        className="
        absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold
       bg-gray-200 text-black dark:bg-gray-800 dark:text-white
        shadow hover:scale-105 transition-all"
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>



      {/* Instructions */}
      {showInstructions && (
  <div
    className="
      absolute top-4 left-4 
      px-4 py-3
      rounded-xl
      shadow-lg
      border
      transition-all duration-300
      bg-white/80 dark:bg-gray-900/80 
      border-gray-300 dark:border-gray-700
      backdrop-blur-md
      text-gray-800 dark:text-gray-100
      animate-fadeIn
      max-w-xs
    "
  >
    <h3 className="font-semibold mb-2 flex items-center gap-2">
      <Sparkles size={16} className="text-yellow-500" />
      Canvas Instructions
    </h3>

    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
      <li>• Click toolbar icons to add nodes</li>
      <li>• Drag nodes to move them</li>
      <li>• Connect nodes by dragging from circles</li>
      <li>• Delete: Select and press Delete key</li>
      <li>• Pan: Use Pan tool or hold Space</li>
    </ul>
  </div>
)}
    </div>

  );
};


