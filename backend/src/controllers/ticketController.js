const pool = require("../db");

const createTicket = async (req,res) => {
    try{
// 1. Read JSON sent by the frontend
    const{employee_id, asset_id,title,description,priority} = req.body;
    
    // 2. Business validation
    if(!employee_id || !title || !description){
        return res.status(400).json({
            error: "Employee, title and description are required"
        });
    }
            // 3. Insert into PostgreSQL

    const result  = await pool.query(
        `
        INSERT INTO tickets
            (employee_id, asset_id, title, description, priority)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `,
        [ employee_id,
                asset_id,
                title,
                description,
                priority || "MEDIUM"]
    );
        // 4. Send created ticket back
    return res.status(201).json(result.rows[0])
}
catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

const updateTicketStatus = async (req, res) => {
    console.log("PATCH endpoint reached");
    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { id } = req.params;
        const { status, changed_by } = req.body;

        const current = await client.query(
            `SELECT status
             FROM tickets
             WHERE ticket_id = $1`,
            [id]
        );

        if (current.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                error: "Ticket not found"
            });
        }

        const oldStatus = current.rows[0].status;

        const updated = await client.query(
            `UPDATE tickets
             SET status = $1
             WHERE ticket_id = $2
             RETURNING *`,
            [status, id]
        );

        await client.query(
            `INSERT INTO ticket_history
            (ticket_id, old_status, new_status, changed_by)
            VALUES ($1,$2,$3,$4)`,
            [id, oldStatus, status, changed_by]
        );

        await client.query("COMMIT");

        return res.json(updated.rows[0]);

    } catch (err) {

        await client.query("ROLLBACK");

        return res.status(500).json({
            error: "Transaction failed"
        });

    } finally {

        client.release();

    }
};

module.exports = { createTicket,
    updateTicketStatus
};

// HTTP STATUS CODES REFERENCE FOR EXPRESS CONTROLLERS

// 200 - OK
// Use when: A request successfully reads, updates, or deletes data (e.g., res.status(200).json(tickets))
// res.status(200);

// 201 - CREATED
// Use when: A new record is successfully created in the database (e.g., res.status(201).json(newTicket))
// res.status(201);

// 400 - BAD REQUEST
// Use when: Client sends invalid input or missing required fields (e.g., missing title or employee_id)
// res.status(400);

// 404 - NOT FOUND
// Use when: The requested resource/ID does not exist in the database (e.g., ticket ID #999 not found)
// res.status(404);

// 500 - INTERNAL SERVER ERROR
// Use inside catch blocks: Server encountered an unexpected error, crash, or database failure
// res.status(500);