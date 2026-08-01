// const express = require('express');
// const router = express.Router();

// const VIRTUAL_NODE_COUNT = 3;

// let nodes = []; // [{ id, name, hash, virtualNodes }]
// let dataKeys = []; // [{ key, hash, assignedNode, assignedVirtualNode }]

// const hashFn = (str) =>
//   parseInt(
//     require('crypto').createHash('md5').update(str).digest('hex').slice(0, 8),
//     16
//   );

// function redistribute() {
//   if (nodes.length === 0) {
//     dataKeys.forEach((dataKey) => {
//       dataKey.assignedNode = null;
//       dataKey.assignedVirtualNode = null;
//     });
//     return;
//   }

//   const sortedVirtualNodes = nodes
//     .flatMap((node) =>
//       node.virtualNodes.map((virtualNode) => ({
//         ...virtualNode,
//         physicalNode: node,
//       }))
//     )
//     .sort((a, b) => a.hash - b.hash);

//   dataKeys.forEach((dataKey) => {
//     let assigned = sortedVirtualNodes.find(
//       (virtualNode) => virtualNode.hash >= dataKey.hash
//     );
//     if (!assigned) assigned = sortedVirtualNodes[0];

//     dataKey.assignedNode = assigned.physicalNode;
//     dataKey.assignedVirtualNode = {
//       id: assigned.id,
//       index: assigned.index,
//       hash: assigned.hash,
//     };
//   });
// }

// router.get('/state', (req, res) => {
//   res.json({ nodes, dataKeys });
// });

// router.post('/add-node', (req, res) => {
//   const name = req.body.name?.trim();

//   if (!name) {
//     return res.status(400).json({ message: 'Node name is required' });
//   }

//   if (nodes.some((node) => node.name === name)) {
//     return res.status(409).json({ message: `Node "${name}" already exists` });
//   }

//   const hash = hashFn(name);
//   const virtualNodes = Array.from({ length: VIRTUAL_NODE_COUNT }, (_, index) => ({
//     id: `${name}#${index}`,
//     index,
//     hash: hashFn(`${name}#${index}`),
//   }));
//   const node = { id: Date.now(), name, hash, virtualNodes };
//   nodes.push(node);
//   redistribute();
//   res.json({ nodes, dataKeys });
// });

// router.post('/remove-node', (req, res) => {
//   const name = req.body.name?.trim();

//   if (!name) {
//     return res.status(400).json({ message: 'Node name is required' });
//   }

//   nodes = nodes.filter((node) => node.name !== name);
//   redistribute();
//   res.json({ nodes, dataKeys });
// });

// router.post('/add-key', (req, res) => {
//   const key = req.body.key?.trim();

//   if (!key) {
//     return res.status(400).json({ message: 'Key is required' });
//   }

//   if (dataKeys.some((dataKey) => dataKey.key === key)) {
//     return res.status(409).json({ message: `Key "${key}" already exists` });
//   }

//   const hash = hashFn(key);
//   dataKeys.push({ key, hash, assignedNode: null });
//   redistribute();
//   res.json({ nodes, dataKeys });
// });

// router.post('/reset', (req, res) => {
//   nodes = [];
//   dataKeys = [];
//   res.json({ nodes, dataKeys });
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Node = require('../models/Node');
const DataKey = require('../models/DataKey');

const VIRTUAL_NODE_COUNT = 3;

const hashFn = (str) =>
  parseInt(
    require('crypto').createHash('md5').update(str).digest('hex').slice(0, 8),
    16
  );

async function redistribute() {
  const nodes = await Node.find();
  const dataKeys = await DataKey.find();

  if (nodes.length === 0) {
    await DataKey.updateMany({}, { assignedNode: null, assignedVirtualNode: null });
    return;
  }

  const sortedVirtualNodes = nodes
    .flatMap((node) =>
      node.virtualNodes.map((virtualNode) => ({
        ...virtualNode.toObject(),
        physicalNode: node,
      }))
    )
    .sort((a, b) => a.hash - b.hash);

  for (const dataKey of dataKeys) {
    let assigned = sortedVirtualNodes.find((vn) => vn.hash >= dataKey.hash);
    if (!assigned) assigned = sortedVirtualNodes[0];

    dataKey.assignedNode = assigned.physicalNode._id;
    dataKey.assignedVirtualNode = {
      id: assigned.id,
      index: assigned.index,
      hash: assigned.hash,
    };
    await dataKey.save();
  }
}

router.get('/state', async (req, res) => {
  const nodes = await Node.find();
  const dataKeys = await DataKey.find().populate('assignedNode');
  res.json({ nodes, dataKeys });
});

router.post('/add-node', async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) return res.status(400).json({ message: 'Node name is required' });

  const existing = await Node.findOne({ name });
  if (existing) return res.status(409).json({ message: `Node "${name}" already exists` });

  const hash = hashFn(name);
  const virtualNodes = Array.from({ length: VIRTUAL_NODE_COUNT }, (_, index) => ({
    id: `${name}#${index}`,
    index,
    hash: hashFn(`${name}#${index}`),
  }));

  await Node.create({ name, hash, virtualNodes });
  await redistribute();

  const nodes = await Node.find();
  const dataKeys = await DataKey.find().populate('assignedNode');
  res.json({ nodes, dataKeys });
});

router.post('/remove-node', async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) return res.status(400).json({ message: 'Node name is required' });

  await Node.deleteOne({ name });
  await redistribute();

  const nodes = await Node.find();
  const dataKeys = await DataKey.find().populate('assignedNode');
  res.json({ nodes, dataKeys });
});

router.post('/add-key', async (req, res) => {
  const key = req.body.key?.trim();
  if (!key) return res.status(400).json({ message: 'Key is required' });

  const existing = await DataKey.findOne({ key });
  if (existing) return res.status(409).json({ message: `Key "${key}" already exists` });

  const hash = hashFn(key);
  await DataKey.create({ key, hash, assignedNode: null });
  await redistribute();

  const nodes = await Node.find();
  const dataKeys = await DataKey.find().populate('assignedNode');
  res.json({ nodes, dataKeys });
});

router.post('/reset', async (req, res) => {
  await Node.deleteMany({});
  await DataKey.deleteMany({});
  res.json({ nodes: [], dataKeys: [] });
});

module.exports = router;