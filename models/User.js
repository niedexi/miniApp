const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    wxID: {
        type: String,
        required: true
    },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  province: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  }
});

let User = mongoose.model("user", UserSchema);
module.exports = User;
