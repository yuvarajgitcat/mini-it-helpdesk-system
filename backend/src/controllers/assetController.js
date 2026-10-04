const pool = require("../db");

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

module.exports = {
    getAllAssets
};