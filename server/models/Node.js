const mongoose = require('mongoose');

const virtualNodeSchema = new mongoose.Schema({
  id: String,
  index: Number,
  hash: Number,
}, { _id: false });

const nodeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hash: { type: Number, required: true },
  virtualNodes: [virtualNodeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Node', nodeSchema);