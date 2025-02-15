const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  time: {
    type: Date,
    default: Date.now
  },
  username: String,
  province: String,
  region: String,
  product: String,
  type: String,
  quantity: Number,
  memo: String,
  
});

let Order = mongoose.model("order", OrderSchema);
module.exports = Order;
