const crypto = require("crypto");
const fs = require("fs");

const pool = require("../db");


const calculateSHA256 = (
    filePath
) => {

    const fileBuffer =
        fs.readFileSync(
            filePath
        );


    return crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

};


const uploadEvidence = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {
            uploaded_by
        } = req.body;


        if (!req.file) {

            return res.status(400).json({

                error:
                    "Evidence file is required"

            });

        }


        // -------------------------------------------------
        // Verify ticket exists
        // -------------------------------------------------

        const ticketResult =
            await pool.query(
                `
                SELECT ticket_id
                FROM tickets
                WHERE ticket_id = $1
                `,
                [id]
            );


        if (
            ticketResult.rows.length === 0
        ) {

            fs.unlinkSync(
                req.file.path
            );


            return res.status(404).json({

                error:
                    "Ticket not found"

            });

        }


        // -------------------------------------------------
        // Calculate file fingerprint
        // -------------------------------------------------

        const sha256Hash =
            calculateSHA256(
                req.file.path
            );


        // -------------------------------------------------
        // Detect exact duplicate
        // -------------------------------------------------

        const duplicateResult =
            await pool.query(
                `
                SELECT
                    evidence_id,
                    ticket_id,
                    original_filename
                FROM ticket_evidence
                WHERE sha256_hash = $1
                LIMIT 1
                `,
                [sha256Hash]
            );


        if (
            duplicateResult.rows.length > 0
        ) {

            fs.unlinkSync(
                req.file.path
            );


            return res.status(409).json({

                error:
                    "Duplicate evidence detected",

                duplicate:
                    duplicateResult.rows[0]

            });

        }


        // -------------------------------------------------
        // Store relative path
        // -------------------------------------------------

        const storagePath =
            `uploads/${req.file.filename}`;


        // -------------------------------------------------
        // Insert metadata
        // -------------------------------------------------

        const result =
            await pool.query(
                `
                INSERT INTO ticket_evidence
                (
                    ticket_id,
                    original_filename,
                    stored_filename,
                    mime_type,
                    file_size_bytes,
                    sha256_hash,
                    storage_path,
                    uploaded_by
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING
                    evidence_id,
                    ticket_id,
                    original_filename,
                    stored_filename,
                    mime_type,
                    file_size_bytes,
                    sha256_hash,
                    uploaded_at,
                    uploaded_by;
                `,
                [
                    id,
                    req.file.originalname,
                    req.file.filename,
                    req.file.mimetype,
                    req.file.size,
                    sha256Hash,
                    storagePath,
                    uploaded_by
                        ? Number(uploaded_by)
                        : null
                ]
            );


        return res.status(201).json(
            result.rows[0]
        );


    } catch (error) {

        console.error(
            "Evidence upload error:",
            error
        );


        if (
            req.file &&
            fs.existsSync(
                req.file.path
            )
        ) {

            fs.unlinkSync(
                req.file.path
            );

        }


        return res.status(500).json({

            error:
                "Unable to upload evidence"

        });

    }

};


const getTicketEvidence = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const result =
            await pool.query(
                 `
        SELECT
            te.evidence_id,
            te.ticket_id,
            te.original_filename,
            te.mime_type,
            te.file_size_bytes,
            te.sha256_hash,
            te.uploaded_at,
            e.name AS uploaded_by_name,
            CONCAT('/uploads/', te.stored_filename) AS file_url
        FROM ticket_evidence te
        LEFT JOIN employees e
            ON te.uploaded_by = e.employee_id
        WHERE te.ticket_id = $1
        ORDER BY te.uploaded_at DESC;
        `,
                [id]
            );


        return res.json(
            result.rows
        );


    } catch (error) {

        console.error(
            "Evidence fetch error:",
            error
        );


        return res.status(500).json({

            error:
                "Unable to fetch ticket evidence"

        });

    }

};


module.exports = {

    uploadEvidence,

    getTicketEvidence

};