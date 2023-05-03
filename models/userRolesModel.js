const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
  //   roleId: {
  //     type: String,
  //     unique: true,
  //     required: [true, "Role Id required"],
  //   },
  role: {
    type: String,
    unique: true,
    required: [true, "Role is required"],
  },
  permissions: [
    {
      path: String,
      method: String,
    },
  ],
});
module.exports = mongoose.model("Roles", RoleSchema);
