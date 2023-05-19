const mongoose = require("mongoose");

const catalogSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    vertical: { type: String },
    is_primary: { type: Boolean },
});

module.exports = mongoose.model("catalog", catalogSchema);
