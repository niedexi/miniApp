const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: Schema.Types.String,
    ref: "user"
  },
  phone: {
    type: Schema.Types.Number,
    ref: "user"
  },
  province: {
    type: Schema.Types.String,
    ref: "user"
  },
  region: {
    type: Schema.Types.String,
    ref: "user"
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
