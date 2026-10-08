const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const { register , login } = require("../controller/authcontrolers");

router.post("/register", upload.single("photo"), register);

router.post("/login", login);

module.exports = router;