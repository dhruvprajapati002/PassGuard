const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema(
  {
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: String, required: true },
    usernameOrEmail: { type: String, required: true },
    password: { type: String, required: true },
    iv: { type: String, required: true }, // for AES decryption
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vault", vaultSchema);
