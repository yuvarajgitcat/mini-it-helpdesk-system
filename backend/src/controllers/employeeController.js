const pool = require("../db");


// =========================================================
// GET ALL EMPLOYEES
// =========================================================

const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                employee_id,
                name,
                email,
                department,
                created_at
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


// =========================================================
// GET EMPLOYEE TICKETS
// =========================================================

const getEmployeeTickets = async (req, res) => {
    try {
        const { id } = req.params;

        const employeeResult = await pool.query(
            `
            SELECT
                employee_id,
                name,
                email,
                department
            FROM employees
            WHERE employee_id = $1;
            `,
            [id]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                error: "Employee not found"
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
                a.asset_tag

            FROM tickets t

            LEFT JOIN assets a
                ON t.asset_id = a.asset_id

            WHERE t.employee_id = $1

            ORDER BY t.created_at DESC;
            `,
            [id]
        );


        return res.json({
            employee: employeeResult.rows[0],
            tickets: ticketResult.rows
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch employee tickets"
        });
    }
};


module.exports = {
    getAllEmployees,
    getEmployeeTickets
};