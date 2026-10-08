const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload =
    require("../middleware/uploadMiddleware");

const {
    uploadEvidence,
    getTicketEvidence
} = require(
    "../controllers/evidenceController"
);


router.post(
    "/tickets/:id/evidence",

    upload.single("evidence"),

    uploadEvidence
);


// Multer error handler for this router
router.use(
    (error, req, res, next) => {

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code === "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    error:
                        "File exceeds the 10 MB limit"

                });

            }


            return res.status(400).json({

                error:
                    error.message

            });

        }


        if (error) {

            return res.status(400).json({

                error:
                    error.message

            });

        }


        next();

    }
);


router.get(
    "/tickets/:id/evidence",
    getTicketEvidence
);


module.exports = router;