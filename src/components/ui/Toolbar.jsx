import { useState } from "react";
import {
  MousePointer2,
  Hand,
  Type,
  Image,
  Square,
  MessageSquare,
  Sparkles,
  StickyNote,
  Circle,
  Triangle,
  Minus,
  Star,
} from "lucide-react";

export default function Toolbar({ activeTool, setActiveTool, onAddNode }) {
  const [showShapeMenu, setShowShapeMenu] = useState(false);

  const tools = [
    { icon: MousePointer2, label: "Select", tool: "select", color: "text-gray-300" },
    { icon: Hand, label: "Pan", tool: "pan", color: "text-gray-300" },
    { icon: Type, label: "Text", tool: "textNode", color: "text-blue-400" },
    { icon: Image, label: "Image", tool: "imageNode", color: "text-purple-400" },
    { icon: StickyNote, label: "Comment", tool: "commentNode", color: "text-yellow-400" },
    { icon: Square, label: "Shapes", tool: "shapes", color: "text-green-400", hasMenu: true },
    { icon: Sparkles, label: "Ask AI", tool: "queryNode", color: "text-pink-400" },
  ];

  const shapes = [
    { icon: Square, label: "Rectangle", type: "rectangle" },
    { icon: Circle, label: "Ellipse", type: "ellipse" },
    { icon: Triangle, label: "Triangle", type: "triangle" },
    { icon: Star, label: "Star", type: "star" },
    { icon: Minus, label: "Line", type: "line" },
  ];

  const handleToolClick = (tool) => {
    if (tool === "shapes") {
      setShowShapeMenu(!showShapeMenu);
      return;
    }

    setActiveTool(tool);

    const nodeTypes = ["textNode", "imageNode", "commentNode", "queryNode"];
    if (nodeTypes.includes(tool)) {
      onAddNode(tool);
    }
  };

  const handleShapeClick = (shapeType) => {
    onAddNode("shapeNode", { shapeType });
    setShowShapeMenu(false);
    setActiveTool("select");
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* Shape Menu */}
      {showShapeMenu && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-2 shadow-2xl flex gap-1">
          {shapes.map((shape, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => handleShapeClick(shape.type)}
                className="p-3 rounded-xl transition-all duration-200 transform hover:scale-110 hover:bg-gray-800 text-green-400"
              >
                <shape.icon size={20} strokeWidth={2} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {shape.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Toolbar */}
      <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-2 shadow-2xl flex gap-1">
        {tools.map((btn, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => handleToolClick(btn.tool)}
              className={`
                p-3 rounded-xl transition-all duration-200 transform 
                hover:scale-110 hover:bg-gray-800
                ${
                  activeTool === btn.tool || (btn.tool === "shapes" && showShapeMenu)
                    ? "bg-gray-800 scale-110 shadow-lg"
                    : "hover:bg-gray-800/50"
                }
                ${btn.color}
              `}
            >
              <btn.icon size={20} strokeWidth={2} />
              {btn.hasMenu && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              )}
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {btn.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}