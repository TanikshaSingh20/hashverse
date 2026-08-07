const mongoose = require('mongoose');

const dataKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  hash: { type: Number, required: true },
  assignedNode: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', default: null },
  assignedVirtualNode: {
    id: String,
    index: Number,
    hash: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('DataKey', dataKeySchema);