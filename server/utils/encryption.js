const crypto = require("crypto");
require("dotenv").config();
const algorithm = "aes-256-cbc"; // AES with 256-bit key and CBC mode
const key = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY)
  .digest(); // 32-byte key

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
};

exports.decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
