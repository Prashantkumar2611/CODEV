const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  files: {
    type: [{
      filename: String,
      code: String,
      language: String,
      creator: String // Username of the creator
    }],
    default: [{ filename: "main.js", code: "// Start coding here\n", language: "javascript", creator: "system" }]
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
