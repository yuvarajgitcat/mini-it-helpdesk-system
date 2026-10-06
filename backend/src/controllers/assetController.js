const pool = require("../db");


// =========================================================
// GET ALL ASSETS
// =========================================================

const getAllAssets = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                asset_id,
                asset_tag,
                asset_type,
                model,
                purchase_date,
                status
            FROM assets
            ORDER BY asset_tag;
            `
        );

        return res.json(result.rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch assets"
        });
    }
};


// =========================================================
// GET ASSET TICKETS
// =========================================================

const getAssetTickets = async (req, res) => {
    try {
        const { id } = req.params;


        const assetResult = await pool.query(
            `
            SELECT
                asset_id,
                asset_tag,
                asset_type,
                model,
                purchase_date,
                status
            FROM assets
            WHERE asset_id = $1;
            `,
            [id]
        );


        if (assetResult.rows.length === 0) {
            return res.status(404).json({
                error: "Asset not found"
            });
        }


        const ticketResult = await pool.query(
            `
            SELECT
                t.ticket_id,
                t.title,
                t.priority,
                t.status,
                t.created_at,
                e.name AS employee_name

            FROM tickets t

            JOIN employees e
                ON t.employee_id = e.employee_id

            WHERE t.asset_id = $1

            ORDER BY t.created_at DESC;
            `,
            [id]
        );


        return res.json({
            asset: assetResult.rows[0],
            tickets: ticketResult.rows
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch asset tickets"
        });
    }
};


module.exports = {
    getAllAssets,
    getAssetTickets
};