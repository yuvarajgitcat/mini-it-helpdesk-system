const pool = require("../db");

const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                employee_id,
                name,
                email,
                department
            FROM employees
            ORDER BY name;
            `
        );

        return res.json(result.rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch employees"
        });
    }
};

module.exports = {
    getAllEmployees
};