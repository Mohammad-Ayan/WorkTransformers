import { useState, useEffect, useRef } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import ResizableWrapper from "../ui/ResizableWrapper";

export default function QueryNode({ id }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const resultRef = useRef(null);
  const { getNodes, getEdges, setNodes } = useReactFlow();

  // Auto-expand the node when result changes
  useEffect(() => {
    if (result && resultRef.current) {
      const contentHeight = resultRef.current.scrollHeight;
      const newHeight = Math.max(200, Math.min(contentHeight + 120, 600));

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              style: {
                ...node.style,
                width: isExpanded ? 500 : 320,
                height: newHeight,
              },
            };
          }
          return node;
        })
      );
    }
  }, [result, id, setNodes, isExpanded]);

  const getConnectedContext = () => {
    const incomingEdges = getEdges().filter(e => e.target === id);

    const connectedNodes = incomingEdges
      .map(edge => getNodes().find(n => n.id === edge.source))
      .filter(Boolean);

    console.log("🔗 CONNECTED NODES →", connectedNodes);

    const textItems = connectedNodes
      .filter(n => n.type === "textNode" || n.type === "commentNode")
      .map(n => n.data.text || n.data.label || "");

    const shapeItems = connectedNodes
      .filter(n => n.type === "shapeNode")
      .map(n => `Shape: ${n.data.label || 'unnamed shape'}`);

    const images = connectedNodes
      .filter(n => n.type === "imageNode")
      .map(n => n.data.src)
      .filter(Boolean);

    console.log("DEBUG → Edges:", getEdges());
    console.log("DEBUG → Nodes:", getNodes());
    console.log("DEBUG → Incoming Edges:", incomingEdges);
    console.log("DEBUG → Connected Node Objects:", connectedNodes);
    console.log("DEBUG → TEXT:", textItems);
    console.log("DEBUG → SHAPES:", shapeItems);
    console.log("DEBUG → IMAGES:", images);

    return { textItems, shapeItems, images };
  };

  const sendToAI = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult("");
    setIsExpanded(true);

    const ctx = getConnectedContext();
    console.log("📝 CONTEXT SENT →", ctx);

    const form = new FormData();
    form.append("query", query);
    form.append("context", [...ctx.textItems, ...ctx.shapeItems].join("\n\n"));

    const API_BASE =
      import.meta.env.VITE_API_URL || "http://localhost:5000";

    fetch(`${API_BASE}/api/ai`, {
      method: "POST",
      body: formData,
    });


    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let full = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const txt = decoder.decode(value);
      console.log("🔹 CHUNK:", txt);

      full += txt;
      setResult(prev => prev + txt);
    }

    console.log("💡 FINAL AI RESPONSE:", full);

    setLoading(false);
  };


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ResizableWrapper id={id} minWidth={240} minHeight={130}>
      <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl w-full h-full flex flex-col border-2 border-purple-300 dark:border-purple-700">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
            ✨ AI Assistant
          </span>
          <button
            onClick={toggleExpand}
            className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded hover:bg-purple-300 dark:hover:bg-purple-700"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        {/* Query Input */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-sm"
          placeholder="Ask something..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && query.trim()) {
              sendToAI();
            }
          }}
        />

        {/* Ask Button */}
        <button
          onClick={sendToAI}
          disabled={loading || !query.trim()}
          className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white w-full py-2 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100 shadow-md"
        >
          {loading ? "🤔 Thinking..." : "✨ Ask AI"}
        </button>

        {/* Response Area */}
        <div
          ref={resultRef}
          className="mt-3 p-3 text-sm whitespace-pre-wrap flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 min-h-[60px]"
        >
          {loading && !result && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin">⚙️</div>
              <span>Thinking...</span>
            </div>
          )}
          {result && (
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {result}
            </div>
          )}
          {!loading && !result && (
            <div className="text-gray-400 text-center italic">
              Response will appear here...
            </div>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-pink-500"
      />
    </ResizableWrapper>
  );
}