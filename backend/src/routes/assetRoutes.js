const express = require("express");

const router = express.Router();

const {
    getAllAssets,
    getAssetTickets
} = require("../controllers/assetController");


router.get("/", getAllAssets);

router.get("/:id/tickets", getAssetTickets);


module.exports = router;