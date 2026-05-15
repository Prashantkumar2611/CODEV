const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  files: {
    type: Map,
    of: new mongoose.Schema({
      code: String,
      language: String
    }),
    default: {
      "main.js": { code: "// Start coding here\n", language: "javascript" },
      "index.html": { code: "<!-- HTML here -->\n", language: "html" },
      "style.css": { code: "/* CSS here */\n", language: "css" }
    }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
