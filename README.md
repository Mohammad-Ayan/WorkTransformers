# 🎨 AI Canvas Builder (ReactFlow + Gemini AI)

A visual canvas tool powered by **ReactFlow**, **Node.js**, and **Gemini AI**, allowing users to:

- Create and arrange text, shapes, comments, images
- Connect nodes visually
- Ask AI for context-aware answers based on connected nodes
- Auto-resizable nodes (Figma-style)
- Real-time AI streaming responses
- Editable and extendable open-source architecture

---

## 🚀 Features

### 🟣 Visual Canvas Editor
- Drag & drop nodes
- Resizable shapes (rectangle, ellipse, line, star)
- Text nodes, comment nodes, image nodes
- Connector lines between elements

### 🤖 AI-Powered Query Node
- Streams responses using **Gemini Flash / 2.0 / 2.5**
- Uses context from connected nodes (text, comments, images)
- Produces concise, canvas-compatible answers
- Auto-expands depending on output

### 🧩 Fully Modular Node System
- Add your own node types easily
- Reusable `ResizableWrapper` for Figma-like resizing

---

## 📦 Folder Structure

my-reactflow-ai-canvas/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── uploads/  (auto-created)
│   ├── .env.example
│   └── README_BACKEND.md
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js OR next.config.js
│   ├── src/
│   │    ├── components/
│   │    ├── nodes/
│   │    ├── ui/
│   │    ├── context/
│   │    ├── App.jsx
│   │    ├── main.jsx
│   └── README_FRONTEND.md
│
├── README.md  ← MASTER README
└── LICENSE (optional)

---

## 🔧 Backend Setup

cd server
npm install


Create `.env`:

GEMINI_API_KEY=YOUR_KEY_HERE
PORT=5000


Start server:
node index.js

---

## 🌐 Frontend Setup

cd frontend
npm install
npm run dev

Update backend URL inside QueryNode:

fetch("https://YOUR_BACKEND_URL/api/ai")

yaml
Copy code


---


## 🧠 Want to Contribute?

Pull requests are welcome!

---

## 📜 License
MIT License © 2025

---
