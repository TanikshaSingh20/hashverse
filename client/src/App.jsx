// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import HashRing from './components/HashRing';
// import LogPanel from './components/LogPanel';
// import { getNodeColor } from './utils/nodeColor';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ring';

// function App() {
//   const [nodes, setNodes] = useState([]);
//   const [dataKeys, setDataKeys] = useState([]);
//   const [nodeName, setNodeName] = useState('');
//   const [keyName, setKeyName] = useState('');
//   const [logs, setLogs] = useState([]);

//   const logEvent = (msg) => {
//     setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
//   };

//   const fetchState = async () => {
//     const res = await axios.get(`${API}/state`);
//     setNodes(res.data.nodes);
//     setDataKeys(res.data.dataKeys);
//   };

//   useEffect(() => {
//     fetchState();
//   }, []);

//   const addNode = async () => {
//     if (!nodeName.trim()) return;
//     try {
//       await axios.post(`${API}/add-node`, { name: nodeName });
//       logEvent(`Node "${nodeName.trim()}" added`);
//       fetchState();
//       setNodeName('');
//     } catch (error) {
//       logEvent(error.response?.data?.message || `Failed to add node "${nodeName}"`);
//     }
//   };

//   const removeNode = async () => {
//     if (!nodeName.trim()) return;
//     await axios.post(`${API}/remove-node`, { name: nodeName });
//     logEvent(`Node "${nodeName}" removed`);
//     fetchState();
//     setNodeName('');
//   };

//   const addKey = async () => {
//     if (!keyName.trim()) return;
//     try {
//       await axios.post(`${API}/add-key`, { key: keyName });
//       logEvent(`Key "${keyName.trim()}" added`);
//       fetchState();
//       setKeyName('');
//     } catch (error) {
//       logEvent(error.response?.data?.message || `Failed to add key "${keyName}"`);
//     }
//   };

//   const reset = async () => {
//     await axios.post(`${API}/reset`);
//     logEvent(`System reset`);
//     fetchState();
//   };

//   // Group keys by assigned node
//   const keysByNode = {};
//   nodes.forEach(node => {
//     keysByNode[node.name] = [];
//   });
//   dataKeys.forEach(d => {
//     if (d.assignedNode && d.assignedNode.name) {
//       if (!keysByNode[d.assignedNode.name]) keysByNode[d.assignedNode.name] = [];
//       keysByNode[d.assignedNode.name].push(d.key);
//     }
//   });

//   return (
//     <div className="min-h-screen bg-white text-black pt-8 pb-4">
//       <div className="max-w-5xl mx-auto">
//         {/* <div className="bg-blue-50 p-6 rounded-xl mb-8 shadow">
//           <h2 className="text-3xl font-bold text-black mb-2">What is Consistent Hashing?</h2>
//           <p className="text-base text-gray-700 mt-2">
//             Consistent hashing is a distributed hashing technique that minimizes key redistribution
//             when nodes are added or removed. It’s widely used in systems like distributed caches,
//             load balancers, and DHTs (like Amazon Dynamo or Apache Cassandra).
//           </p>
//         </div> */}
//         <div className="text-center mb-10">
//   <h1 className="text-6xl font-black tracking-tight text-blue-700">
//     HashVerse
//   </h1>

//   <p className="text-gray-600 mt-3 text-xl">
//     Interactive Distributed Hash Ring Simulator
//   </p>

//   <p className="text-gray-500 mt-2">
//     Visualize Consistent Hashing, Virtual Nodes, and Real-Time Key Distribution
//   </p>
// </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

//   <div className="bg-blue-100 rounded-xl p-5 shadow">
//     <h3 className="text-gray-500 text-sm">Servers</h3>
//     <p className="text-3xl font-bold">{nodes.length}</p>
//   </div>

//   <div className="bg-green-100 rounded-xl p-5 shadow">
//     <h3 className="text-gray-500 text-sm">Keys</h3>
//     <p className="text-3xl font-bold">{dataKeys.length}</p>
//   </div>

//   <div className="bg-yellow-100 rounded-xl p-5 shadow">
//     <h3 className="text-gray-500 text-sm">Virtual Nodes</h3>
//     <p className="text-3xl font-bold">
//       {nodes.reduce(
//         (sum, node) => sum + (node.virtualNodes?.length || 1),
//         0
//       )}
//     </p>
//   </div>

//   <div className="bg-purple-100 rounded-xl p-5 shadow">
//     <h3 className="text-gray-500 text-sm">Load Balance</h3>
//     <p className="text-3xl font-bold">
//       {nodes.length ? "Healthy" : "--"}
//     </p>
//   </div>

// </div>
//         <div className="flex flex-wrap gap-4 mb-10 justify-center">
//           <input
//             value={nodeName}
//             onChange={e => setNodeName(e.target.value)}
//             placeholder="Node Name"
//             className="p-3 text-black bg-white rounded-lg border-2 border-blue-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//           <button
//             onClick={addNode}
//             className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold text-white transition"
//           >
//             Add Node
//           </button>
//           <button
//             onClick={removeNode}
//             className="bg-red-500 hover:bg-red-600 p-3 rounded-lg font-semibold text-white transition"
//           >
//             Remove Node
//           </button>
//           <input
//             value={keyName}
//             onChange={e => setKeyName(e.target.value)}
//             placeholder="Key"
//             className="p-3 text-black bg-white rounded-lg border-2 border-blue-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//           <button
//             onClick={addKey}
//             className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold text-white transition"
//           >
//             Add Key
//           </button>
//           <button
//             onClick={reset}
//             className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-semibold text-black transition"
//           >
//             Reset
//           </button>
//         </div>

//         {/* Node-Key Mapping Section */}
//         <div className="mb-10 bg-gray-100 p-6 rounded-xl shadow">
//           <h3 className="text-xl font-bold mb-4 text-black">Node-Key Mapping</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {nodes.length === 0 ? (
//               <div className="text-gray-400 col-span-2">No nodes present.</div>
//             ) : (
//               nodes.map((node, idx) => (
//                 <div key={node.name} className="bg-white p-4 rounded-lg shadow border border-blue-100">
//                   <div
//                     className="font-bold text-black mb-2 text-lg flex items-center gap-2"
//                     title={`Node: ${node.name} (Node #${idx + 1})`}
//                   >
//                     <span
//                       className="inline-block w-3 h-3 rounded-full"
//                       style={{ backgroundColor: getNodeColor(node.name) }}
//                     ></span>
//                     {node.name}
//                     <span className="text-xs font-normal text-gray-500">
//                       ({node.virtualNodes?.length || 1} virtual nodes)
//                     </span>
//                   </div>
//                   <div className="text-sm flex flex-wrap gap-2">
//                     {keysByNode[node.name] && keysByNode[node.name].length > 0
//                       ? keysByNode[node.name].map((key, kidx) => (
//                           <span
//                             key={key}
//                             className="inline-block bg-blue-50 px-3 py-1 rounded-full text-blue-700 border border-blue-400"
//                             title={`Key: ${key} (Key #${kidx + 1})`}
//                           >
//                             {key}
//                           </span>
//                         ))
//                       : <span className="text-gray-400">No keys</span>
//                     }
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <HashRing nodes={nodes} dataKeys={dataKeys} />
//           </div>
//           <div>
//             <LogPanel logs={logs} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;































































// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import HashRing from './components/HashRing';
// import LogPanel from './components/LogPanel';
// import { getNodeColor } from './utils/nodeColor';
// import {
//   FaServer,
//   FaDatabase,
//   FaProjectDiagram,
//   FaBalanceScale
// } from "react-icons/fa";

// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ring';

// function App() {
//   const [nodes, setNodes] = useState([]);
//   const [dataKeys, setDataKeys] = useState([]);
//   const [nodeName, setNodeName] = useState('');
//   const [keyName, setKeyName] = useState('');
//   const [logs, setLogs] = useState([]);

//   const logEvent = (msg) => {
//     setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
//   };

//   const fetchState = async () => {
//     const res = await axios.get(`${API}/state`);
//     setNodes(res.data.nodes);
//     setDataKeys(res.data.dataKeys);
//   };

//   useEffect(() => {
//     fetchState();
//   }, []);

//   const addNode = async () => {
//     if (!nodeName.trim()) return;
//     try {
//       await axios.post(`${API}/add-node`, { name: nodeName });
//       logEvent(`Node "${nodeName.trim()}" added`);
//       fetchState();
//       setNodeName('');
//     } catch (error) {
//       logEvent(error.response?.data?.message || `Failed to add node "${nodeName}"`);
//     }
//   };

//   const removeNode = async () => {
//     if (!nodeName.trim()) return;
//     await axios.post(`${API}/remove-node`, { name: nodeName });
//     logEvent(`Node "${nodeName}" removed`);
//     fetchState();
//     setNodeName('');
//   };

//   const addKey = async () => {
//     if (!keyName.trim()) return;
//     try {
//       await axios.post(`${API}/add-key`, { key: keyName });
//       logEvent(`Key "${keyName.trim()}" added`);
//       fetchState();
//       setKeyName('');
//     } catch (error) {
//       logEvent(error.response?.data?.message || `Failed to add key "${keyName}"`);
//     }
//   };

//   const reset = async () => {
//     await axios.post(`${API}/reset`);
//     logEvent(`System reset`);
//     fetchState();
//   };

//   // Group keys by assigned node
//   const keysByNode = {};
//   nodes.forEach(node => {
//     keysByNode[node.name] = [];
//   });
//   dataKeys.forEach(d => {
//     if (d.assignedNode && d.assignedNode.name) {
//       if (!keysByNode[d.assignedNode.name]) keysByNode[d.assignedNode.name] = [];
//       keysByNode[d.assignedNode.name].push(d.key);
//     }
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-black pt-8 pb-10">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-12">
//           <h1 className="text-6xl font-black tracking-tight text-blue-800">HashVerse</h1>
//           <p className="text-gray-700 mt-4 text-xl">Interactive Distributed Hash Ring Simulator</p>
//           <p className="text-gray-600 mt-1">Visualize Consistent Hashing, Virtual Nodes, and Real-Time Key Distribution</p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//           <div className="bg-blue-200 rounded-xl p-6 shadow-lg border border-blue-300 flex flex-col items-center">
//             <h3 className="text-blue-900 text-sm font-semibold uppercase mb-2 tracking-wide">Physical Nodes</h3>
//             <p className="text-4xl font-extrabold">{nodes.length}</p>
//           </div>

//           <div className="bg-green-200 rounded-xl p-6 shadow-lg border border-green-300 flex flex-col items-center">
//             <h3 className="text-green-900 text-sm font-semibold uppercase mb-2 tracking-wide">Data Objects</h3>
//             <p className="text-4xl font-extrabold">{dataKeys.length}</p>
//           </div>

//           <div className="bg-yellow-200 rounded-xl p-6 shadow-lg border border-yellow-300 flex flex-col items-center">
//             <h3 className="text-yellow-900 text-sm font-semibold uppercase mb-2 tracking-wide">Virtual Nodes</h3>
//             <p className="text-4xl font-extrabold">
//               {nodes.reduce(
//                 (sum, node) => sum + (node.virtualNodes?.length || 1),
//                 0
//               )}
//             </p>
//           </div>

//           <div className="bg-purple-200 rounded-xl p-6 shadow-lg border border-purple-300 flex flex-col items-center">

//   <FaBalanceScale className="text-4xl text-purple-800 mb-3" />

//   <h3 className="text-purple-900 text-sm font-semibold uppercase mb-2 tracking-wide">
//     Cluster Status
//   </h3>

//   <p className="text-4xl font-extrabold">
//     {nodes.length ? "Balanced" : "--"}
//   </p>

// </div>
//             <h3 className="text-purple-900 text-sm font-semibold uppercase mb-2 tracking-wide">Load Balance</h3>
//             <p className="text-4xl font-extrabold">{nodes.length ? "Balanced" : "--"}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300 mb-12 max-w-3xl mx-auto">
//           <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Cluster Management</h2>
//           <p className="text-center text-gray-500 mb-6">Add or remove physical nodes, insert data keys, and observe how consistent hashing redistributes data across the cluster in real time.</p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <input
//               value={nodeName}
//               onChange={e => setNodeName(e.target.value)}
//               placeholder="Node Name"
//               className="p-3 text-black bg-gray-100 rounded-lg border border-blue-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 w-40"
//             />
//             <button
//               onClick={addNode}
//               className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold text-white transition w-32"
//             >
//               Add Node
//             </button>
//             <button
//               onClick={removeNode}
//               className="bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold text-white transition w-32"
//             >
//               Remove Node
//             </button>
//             <input
//               value={keyName}
//               onChange={e => setKeyName(e.target.value)}
//               placeholder="Key"
//               className="p-3 text-black bg-gray-100 rounded-lg border border-blue-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 w-40"
//             />
//             <button
//               onClick={addKey}
//               className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold text-white transition w-32"
//             >
//               Add Key
//             </button>
//             <button
//               onClick={reset}
//               className="bg-gray-300 hover:bg-gray-400 p-3 rounded-lg font-semibold text-black transition w-32"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Server to Key Assignment Section */}
//         <div className="mb-10 bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 max-w-5xl mx-auto">
//           <h3 className="text-2xl font-bold mb-6 text-gray-900">Cluster Overview</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {nodes.length === 0 ? (
//               <div className="text-gray-400 col-span-2">No nodes present.</div>
//             ) : (
//               nodes.map((node, idx) => (
//                 <div key={node.name} className="bg-white p-5 rounded-lg shadow border border-blue-100">
//                   <div
//                     className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-3"
//                     title={`Node: ${node.name} (Node #${idx + 1})`}
//                   >
//                     <span
//                       className="inline-block w-4 h-4 rounded-full"
//                       style={{ backgroundColor: getNodeColor(node.name) }}
//                     ></span>
//                     {node.name}
//                     <span className="text-xs font-normal text-gray-500">
//                       ({node.virtualNodes?.length || 1} virtual nodes)
//                     </span>
//                   </div>
//                   <div className="text-sm flex flex-wrap gap-3">
//                     {keysByNode[node.name] && keysByNode[node.name].length > 0
//                       ? keysByNode[node.name].map((key, kidx) => (
//                           <span
//                             key={key}
//                             className="inline-block bg-blue-100 px-3 py-1 rounded-full text-blue-800 border border-blue-400"
//                             title={`Key: ${key} (Key #${kidx + 1})`}
//                           >
//                             {key}
//                           </span>
//                         ))
//                       : <span className="text-gray-400">No keys</span>
//                     }
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//             <HashRing nodes={nodes} dataKeys={dataKeys} />
//           </div>
//           <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
//             <LogPanel logs={logs} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





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
    const res = await axios.get(`${API}/state`);
    setNodes(res.data.nodes);
    setDataKeys(res.data.dataKeys);
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

    await axios.post(`${API}/remove-node`, {
      name: nodeName,
    });

    logEvent(`Node "${nodeName}" removed`);
    fetchState();
    setNodeName("");
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
    await axios.post(`${API}/reset`);
    logEvent("Cluster reset");
    fetchState();
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

          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            About HashVerse
          </h2>

          <p className="text-gray-700 leading-8">

            HashVerse is an interactive visualization platform
            for understanding Consistent Hashing in distributed
            systems.

            <br /><br />

            Users can dynamically add or remove physical nodes,
            insert data objects, and observe how virtual nodes
            minimize data redistribution.

            <br /><br />

            The simulator demonstrates concepts used in
            distributed databases, load balancers,
            caching systems, and cloud infrastructure.

          </p>

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