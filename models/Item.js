const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  productCode: String,
  name: String
});

let Item = mongoose.model("item", ItemSchema);
module.exports = Item;
