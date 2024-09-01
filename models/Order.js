const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  memo: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now
  }
});

let Order = mongoose.model("order", OrderSchema);
module.exports = Order;
