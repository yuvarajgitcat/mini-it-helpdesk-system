const fs = require("fs");
const crypto = require("crypto");

const pool = require("../db");


const calculateSHA256 = (filePath) => {

    const fileBuffer =
        fs.readFileSync(filePath);

    return crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");
};


// =========================================================
// UPLOAD EVIDENCE
// =========================================================

const uploadEvidence = async (req, res) => {

    try {

        const { id } = req.params;

        const ticketResult = await pool.query(
            `
            SELECT ticket_id
            FROM tickets
            WHERE ticket_id = $1;
            `,
            [id]
        );


        if (ticketResult.rows.length === 0) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                error: "Ticket not found"
            });
        }


        if (!req.file) {

            return res.status(400).json({
                error: "Evidence file is required"
            });
        }


        const hash =
            calculateSHA256(req.file.path);


        const duplicateResult =
            await pool.query(
                `
                SELECT
                    evidence_id,
                    ticket_id,
                    original_filename,
                    uploaded_at
                FROM ticket_evidence
                WHERE sha256_hash = $1;
                `,
                [hash]
            );


        if (duplicateResult.rows.length > 0) {

            fs.unlinkSync(req.file.path);

            return res.status(409).json({
                error: "This evidence file already exists",
                existing: duplicateResult.rows
            });
        }


        const result = await pool.query(
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
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            RETURNING *;
            `,
            [
                id,
                req.file.originalname,
                req.file.filename,
                req.file.mimetype,
                req.file.size,
                hash,
                req.file.path,
                req.body.uploaded_by || null
            ]
        );


        return res.status(201).json(
            result.rows[0]
        );

    } catch (err) {

        console.error(err);

        if (req.file) {

            try {
                fs.unlinkSync(req.file.path);
            } catch {}
        }

        return res.status(500).json({
            error: "Unable to upload evidence"
        });
    }
};


// =========================================================
// GET TICKET EVIDENCE
// =========================================================

const getTicketEvidence = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                evidence_id,
                ticket_id,
                original_filename,
                mime_type,
                file_size_bytes,
                sha256_hash,
                uploaded_at,
                uploaded_by
            FROM ticket_evidence
            WHERE ticket_id = $1
            ORDER BY uploaded_at DESC;
            `,
            [id]
        );


        return res.json(result.rows);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch ticket evidence"
        });
    }
};


module.exports = {
    uploadEvidence,
    getTicketEvidence
};