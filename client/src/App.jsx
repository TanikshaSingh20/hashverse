import React, { useEffect, useState } from "react";
import axios from "axios";
import HashRing from "./components/HashRing";
import LogPanel from "./components/LogPanel";
import { getNodeColor } from "./utils/nodeColor";

import {
  FaServer,
  FaDatabase,
  FaProjectDiagram,
  FaBalanceScale,
} from "react-icons/fa";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/ring";

function App() {
  const [nodes, setNodes] = useState([]);
  const [dataKeys, setDataKeys] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [keyName, setKeyName] = useState("");
  const [logs, setLogs] = useState([]);

  const logEvent = (msg) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  };

  const fetchState = async () => {
    try {
      const res = await axios.get(`${API}/state`);
      setNodes(res.data.nodes);
      setDataKeys(res.data.dataKeys);
    } catch (error) {
      logEvent(
        error.response?.data?.message || "Failed to fetch cluster state"
      );
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const addNode = async () => {
    if (!nodeName.trim()) return;

    try {
      await axios.post(`${API}/add-node`, {
        name: nodeName,
      });

      logEvent(`Node "${nodeName}" added`);
      fetchState();
      setNodeName("");
    } catch (error) {
      logEvent(
        error.response?.data?.message ||
          `Failed to add node "${nodeName}"`
      );
    }
  };

  const removeNode = async () => {
    if (!nodeName.trim()) return;

    try {
      await axios.post(`${API}/remove-node`, {
        name: nodeName,
      });

      logEvent(`Node "${nodeName}" removed`);
      fetchState();
      setNodeName("");
    } catch (error) {
      logEvent(
        error.response?.data?.message ||
          `Failed to remove node "${nodeName}"`
      );
    }
  };

  const addKey = async () => {
    if (!keyName.trim()) return;

    try {
      await axios.post(`${API}/add-key`, {
        key: keyName,
      });

      logEvent(`Key "${keyName}" added`);
      fetchState();
      setKeyName("");
    } catch (error) {
      logEvent(
        error.response?.data?.message ||
          `Failed to add key "${keyName}"`
      );
    }
  };

  const reset = async () => {
    try {
      await axios.post(`${API}/reset`);
      logEvent("Cluster reset");
      fetchState();
    } catch (error) {
      logEvent(
        error.response?.data?.message || "Failed to reset cluster"
      );
    }
  };

  const keysByNode = {};

  nodes.forEach((node) => {
    keysByNode[node.name] = [];
  });

  dataKeys.forEach((d) => {
    if (d.assignedNode?.name) {
      if (!keysByNode[d.assignedNode.name])
        keysByNode[d.assignedNode.name] = [];

      keysByNode[d.assignedNode.name].push(d.key);
    }
  });

  const aboutCards = [
    {
      icon: <FaServer className="text-3xl text-blue-600 mb-3" />,
      bg: "bg-blue-50",
      title: "Dynamic Nodes",
      text: "Add or remove physical nodes and instantly see the cluster adapt.",
    },
    {
      icon: <FaProjectDiagram className="text-3xl text-yellow-600 mb-3" />,
      bg: "bg-yellow-50",
      title: "Virtual Nodes",
      text: "See how virtual nodes minimize data redistribution across the ring.",
    },
    {
      icon: <FaBalanceScale className="text-3xl text-purple-600 mb-3" />,
      bg: "bg-purple-50",
      title: "Real-World Concepts",
      text: "Mirrors patterns used in distributed databases, load balancers, and caching systems.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 text-black">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="text-center mb-12">

          <h1 className="text-6xl font-black text-blue-800">
            🚀 HashVerse
          </h1>

          <p className="text-xl text-gray-700 mt-4">
            Interactive Distributed Hash Ring Simulator
          </p>

          <p className="text-gray-500 mt-2">
            Visualize Consistent Hashing, Virtual Nodes, and
            Real-Time Key Distribution
          </p>

        </div>

        {/* Dashboard */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-blue-100 rounded-2xl shadow-lg p-6 flex flex-col items-center">

            <FaServer className="text-4xl text-blue-700 mb-3"/>

            <h3 className="font-semibold uppercase text-blue-900 text-sm">
              Physical Nodes
            </h3>

            <p className="text-4xl font-black mt-2">
              {nodes.length}
            </p>

          </div>

          <div className="bg-green-100 rounded-2xl shadow-lg p-6 flex flex-col items-center">

            <FaDatabase className="text-4xl text-green-700 mb-3"/>

            <h3 className="font-semibold uppercase text-green-900 text-sm">
              Data Objects
            </h3>

            <p className="text-4xl font-black mt-2">
              {dataKeys.length}
            </p>

          </div>

          <div className="bg-yellow-100 rounded-2xl shadow-lg p-6 flex flex-col items-center">

            <FaProjectDiagram className="text-4xl text-yellow-700 mb-3"/>

            <h3 className="font-semibold uppercase text-yellow-900 text-sm">
              Virtual Nodes
            </h3>

            <p className="text-4xl font-black mt-2">
              {nodes.reduce(
                (sum, node) =>
                  sum + (node.virtualNodes?.length || 1),
                0
              )}
            </p>

          </div>

          <div className="bg-purple-100 rounded-2xl shadow-lg p-6 flex flex-col items-center">

            <FaBalanceScale className="text-4xl text-purple-700 mb-3"/>

            <h3 className="font-semibold uppercase text-purple-900 text-sm">
              Cluster Status
            </h3>

            <p className="text-3xl font-black mt-2">
              {nodes.length ? "Balanced" : "--"}
            </p>

          </div>

        </div>

        {/* About */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700">
              About HashVerse
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              An interactive visualization platform for understanding
              Consistent Hashing in distributed systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {aboutCards.map((card) => (
              <div
                key={card.title}
                className={`flex flex-col items-center text-center p-5 rounded-xl ${card.bg}`}
              >
                {card.icon}
                <h3 className="font-semibold text-gray-800 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {card.text}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* Cluster Management */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">

          <h2 className="text-2xl font-bold text-center text-blue-700">
            Cluster Management
          </h2>

          <p className="text-center text-gray-500 mt-3 mb-8">
            Add or remove physical nodes and observe
            real-time redistribution of data.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">

            <input
              value={nodeName}
              onChange={(e)=>setNodeName(e.target.value)}
              placeholder="Node Name"
              className="border rounded-lg p-3 w-40"
            />

            <button
              onClick={addNode}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
            >
              Add Node
            </button>

            <button
              onClick={removeNode}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6"
            >
              Remove Node
            </button>

            <input
              value={keyName}
              onChange={(e)=>setKeyName(e.target.value)}
              placeholder="Key"
              className="border rounded-lg p-3 w-40"
            />

            <button
              onClick={addKey}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6"
            >
              Add Key
            </button>

            <button
              onClick={reset}
              className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg px-6"
            >
              Reset
            </button>

          </div>

        </div>

        {/* Cluster Overview */}

        <div className="mb-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Live Cluster Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {nodes.length === 0 ? (

              <div className="text-gray-500">
                No physical nodes available.
              </div>

            ) : (

              nodes.map((node) => (

                <div
                  key={node.name}
                  className="border rounded-xl p-5 shadow-sm bg-gray-50"
                >

                  <div className="flex items-center gap-3 mb-3">

                    <span
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: getNodeColor(node.name),
                      }}
                    />

                    <h3 className="font-bold text-lg">
                      {node.name}
                    </h3>

                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    Virtual Nodes :
                    {" "}
                    {node.virtualNodes?.length || 1}
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {keysByNode[node.name]?.length ? (

                      keysByNode[node.name].map((key) => (

                        <span
                          key={key}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {key}
                        </span>

                      ))

                    ) : (

                      <span className="text-gray-400">
                        No keys assigned
                      </span>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        {/* Visualization */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Hash Ring Visualization
            </h2>

            <HashRing
              nodes={nodes}
              dataKeys={dataKeys}
            />

          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Event Logs
            </h2>

            <LogPanel logs={logs} />

          </div>

        </div>

        {/* Footer */}

        <footer className="mt-16 text-center border-t pt-8">

          <h3 className="text-xl font-bold text-blue-700">
            HashVerse
          </h3>

          <p className="text-gray-500 mt-2">
            Interactive Distributed Hash Ring Simulator
          </p>

          <p className="text-gray-400 mt-2">
            Built with React • Node.js • Express • MongoDB
          </p>

          <p className="text-gray-400 mt-4">
            © 2026 HashVerse
          </p>

        </footer>

      </div>

    </div>
  );
}

export default App;