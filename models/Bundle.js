const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BundleSchema = new Schema({
  productCode: String,
  name: String,
  item: [String]
});

let Bundle = mongoose.model("bundle", BundleSchema);
module.exports = Bundle;
