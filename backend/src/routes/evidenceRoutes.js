const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadEvidence,
    getTicketEvidence
} = require("../controllers/evidenceController");


router.post(
    "/tickets/:id/evidence",
    upload.single("evidence"),
    uploadEvidence
);


router.get(
    "/tickets/:id/evidence",
    getTicketEvidence
);


module.exports = router;