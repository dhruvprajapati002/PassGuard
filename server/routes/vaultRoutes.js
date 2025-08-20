// server/routes/vaultRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const vaultController = require("../controllers/vaultController");

router.post("/add", auth, vaultController.addPassword);
router.get("/", auth, vaultController.getPasswords);
router.delete("/:id", auth, vaultController.deletePassword);
router.put("/:id", auth, vaultController.updatePassword);


module.exports = router;
