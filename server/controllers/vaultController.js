// server/controllers/vaultController.js
const Vault = require("../models/Vault");
const { encrypt } = require("../utils/encryption");
const { decrypt } = require("../utils/encryption");



// Add password
exports.addPassword = async (req, res) => {
  try {
    const { service, usernameOrEmail, password } = req.body;
    
    const userId = req.user.userId;
   

     // Check if password is missing
    if (!service || !usernameOrEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } 

    


    const { encryptedData, iv } = encrypt(password);

    const newEntry = new Vault({
      user: userId,
      service,
      usernameOrEmail,
      password: encryptedData,
      iv, // store IV for decryption
    });

    await newEntry.save();

    res.status(201).json({ message: 'Password stored successfully' });
  } catch (error) {
    console.error('❌ Vault Add Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get all passwords for user
exports.getPasswords = async (req, res) => {
  try {
    const userId = req.user.userId;
    


    const entries = await Vault.find({ user: userId });

    const decryptedEntries = entries.map((entry) => {
  try {
    // If either password or IV is missing, skip this entry
    if (!entry.password || !entry.iv) {
      console.warn("⚠️ Skipping entry due to missing password or IV:", entry._id);
      return null; // skip this entry
    }

    const decryptedPassword = decrypt(entry.password, entry.iv);
    return {
      _id: entry._id,
      service: entry.service,
      usernameOrEmail: entry.usernameOrEmail,
      password: decryptedPassword,
      createdAt: entry.createdAt,
    };
  } catch (decryptionError) {
    console.error("⚠️ Decryption failed for entry:", entry._id, decryptionError);
    return null; // skip if decryption fails
  }
}).filter(Boolean); // Remove nulls

    res.status(200).json(decryptedEntries);
  } catch (error) {
    console.error("Vault Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Delete entry
exports.deletePassword = async (req, res) => {
  try {
    const vault = await Vault.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!vault) {
      return res.status(404).json({ message: 'Vault item not found' });
    }

    res.status(200).json({ message: 'Password deleted successfully' });
  } catch (err) {
    console.error("❌ Vault Delete Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a password entry
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { service, usernameOrEmail, password } = req.body;

    // Re-encrypt the new password
    const { encryptedData, iv } = encrypt(password);

    const updatedVault = await Vault.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        service,
        usernameOrEmail,
        password: encryptedData,
        iv,
      },
      { new: true }
    );

    if (!updatedVault) {
      return res.status(404).json({ message: 'Vault item not found or unauthorized' });
    }

    res.status(200).json({ message: 'Password updated successfully', updatedVault });
  } catch (error) {
    console.error('❌ Vault Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
