const express = require("express");
const router = express.Router();

const {getAllAssets} = require("../controllers/assetController");

router.get("/",getAllAssets);

module.exports = router;

