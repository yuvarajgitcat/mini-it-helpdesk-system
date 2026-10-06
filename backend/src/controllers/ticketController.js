const pool = require("../db");

const ALLOWED_STATUSES = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED"
];

const ALLOWED_PRIORITIES = [
    "LOW",
    "MEDIUM",
    "HIGH"
];


// =========================================================
// CREATE TICKET
// =========================================================

const createTicket = async (req, res) => {
    try {
        const {
            employee_id,
            asset_id,
            title,
            description,
            priority
        } = req.body;

        if (!employee_id || !title || !description) {
            return res.status(400).json({
                error: "Employee, title and description are required"
            });
        }

        const finalPriority = priority || "MEDIUM";

        if (!ALLOWED_PRIORITIES.includes(finalPriority)) {
            return res.status(400).json({
                error: "Invalid priority"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO tickets
            (
                employee_id,
                asset_id,
                title,
                description,
                priority
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            [
                employee_id,
                asset_id || null,
                title,
                description,
                finalPriority
            ]
        );

        return res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Employee or asset does not exist"
            });
        }

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


// =========================================================
// GET ALL TICKETS
// =========================================================

const getAllTickets = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                t.ticket_id,
                t.title,
                t.description,
                t.priority,
                t.status,
                t.created_at,

                e.employee_id,
                e.name AS employee_name,
                e.department,

                a.asset_id,
                a.asset_tag,
                a.asset_type,
                a.model

            FROM tickets t

            JOIN employees e
                ON t.employee_id = e.employee_id

            LEFT JOIN assets a
                ON t.asset_id = a.asset_id

            ORDER BY t.created_at DESC;
            `
        );

        return res.json(result.rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch tickets"
        });
    }
};


// =========================================================
// GET ONE TICKET
// =========================================================

const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                t.ticket_id,
                t.title,
                t.description,
                t.priority,
                t.status,
                t.created_at,

                e.employee_id,
                e.name AS employee_name,
                e.email AS employee_email,
                e.department,

                a.asset_id,
                a.asset_tag,
                a.asset_type,
                a.model,
                a.purchase_date,
                a.status AS asset_status

            FROM tickets t

            JOIN employees e
                ON t.employee_id = e.employee_id

            LEFT JOIN assets a
                ON t.asset_id = a.asset_id

            WHERE t.ticket_id = $1;
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Ticket not found"
            });
        }

        return res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch ticket"
        });
    }
};


// =========================================================
// UPDATE TICKET STATUS
// =========================================================

const updateTicketStatus = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const { status, changed_by } = req.body;

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                error: "Invalid ticket status"
            });
        }

        await client.query("BEGIN");

        const current = await client.query(
            `
            SELECT status
            FROM tickets
            WHERE ticket_id = $1;
            `,
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
            `
            UPDATE tickets
            SET status = $1
            WHERE ticket_id = $2
            RETURNING *;
            `,
            [status, id]
        );

        await client.query(
            `
            INSERT INTO ticket_history
            (
                ticket_id,
                old_status,
                new_status,
                changed_by
            )
            VALUES ($1, $2, $3, $4);
            `,
            [
                id,
                oldStatus,
                status,
                changed_by || null
            ]
        );

        await client.query("COMMIT");

        return res.json(updated.rows[0]);

    } catch (err) {
        await client.query("ROLLBACK");

        console.error(err);

        if (err.code === "23503") {
            return res.status(400).json({
                error: "Employee does not exist"
            });
        }

        return res.status(500).json({
            error: "Transaction failed"
        });

    } finally {
        client.release();
    }
};


// =========================================================
// GET TICKET HISTORY
// =========================================================

const getTicketHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                h.history_id,
                h.ticket_id,
                h.old_status,
                h.new_status,
                h.changed_by,
                e.name AS changed_by_name,
                h.changed_at

            FROM ticket_history h

            LEFT JOIN employees e
                ON h.changed_by = e.employee_id

            WHERE h.ticket_id = $1

            ORDER BY h.changed_at ASC;
            `,
            [id]
        );

        return res.json(result.rows);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch ticket history"
        });
    }
};


// =========================================================
// TICKET STATISTICS
// =========================================================

const getTicketStatistics = async (req, res) => {
    try {

        const summaryResult = await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_tickets,

                COUNT(*) FILTER (
                    WHERE status = 'OPEN'
                )::int AS open_tickets,

                COUNT(*) FILTER (
                    WHERE status = 'IN_PROGRESS'
                )::int AS in_progress_tickets,

                COUNT(*) FILTER (
                    WHERE status = 'RESOLVED'
                )::int AS resolved_tickets,

                COUNT(*) FILTER (
                    WHERE status = 'CLOSED'
                )::int AS closed_tickets,

                COUNT(*) FILTER (
                    WHERE priority = 'HIGH'
                )::int AS high_priority_tickets

            FROM tickets;
            `
        );


        const statusResult = await pool.query(
            `
            SELECT
                status,
                COUNT(*)::int AS ticket_count

            FROM tickets

            GROUP BY status

            ORDER BY ticket_count DESC;
            `
        );


        const priorityResult = await pool.query(
            `
            SELECT
                priority,
                COUNT(*)::int AS ticket_count

            FROM tickets

            GROUP BY priority

            ORDER BY ticket_count DESC;
            `
        );


        const departmentResult = await pool.query(
            `
            SELECT
                e.department,
                COUNT(t.ticket_id)::int AS ticket_count

            FROM employees e

            LEFT JOIN tickets t
                ON e.employee_id = t.employee_id

            GROUP BY e.department

            ORDER BY ticket_count DESC;
            `
        );


        const assetResult = await pool.query(
            `
            SELECT
                a.asset_tag,
                a.asset_type,
                COUNT(t.ticket_id)::int AS ticket_count

            FROM assets a

            LEFT JOIN tickets t
                ON a.asset_id = t.asset_id

            GROUP BY
                a.asset_id,
                a.asset_tag,
                a.asset_type

            ORDER BY ticket_count DESC;
            `
        );


        return res.json({
            summary: summaryResult.rows[0],
            by_status: statusResult.rows,
            by_priority: priorityResult.rows,
            by_department: departmentResult.rows,
            by_asset: assetResult.rows
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Unable to fetch ticket statistics"
        });
    }
};

const findSimilarTickets = async (req, res) => {

    try {

        const { id } = req.params;


        const currentResult = await pool.query(
            `
            SELECT
                ticket_id,
                title,
                description,
                employee_id,
                asset_id
            FROM tickets
            WHERE ticket_id = $1;
            `,
            [id]
        );


        if (currentResult.rows.length === 0) {

            return res.status(404).json({
                error: "Ticket not found"
            });
        }


        const current =
            currentResult.rows[0];


        const result = await pool.query(
            `
            SELECT
                t.ticket_id,
                t.title,
                t.description,
                t.priority,
                t.status,

                e.name AS employee_name,

                a.asset_tag,

                ROUND(
                    (
                        similarity(
                            t.title,
                            $1
                        ) * 0.55

                        +

                        similarity(
                            t.description,
                            $2
                        ) * 0.25

                        +

                        CASE
                            WHEN t.asset_id = $3
                            THEN 0.20
                            ELSE 0
                        END
                    )::numeric,
                    3
                ) AS similarity_score

            FROM tickets t

            JOIN employees e
                ON t.employee_id = e.employee_id

            LEFT JOIN assets a
                ON t.asset_id = a.asset_id

            WHERE t.ticket_id <> $4

            AND (
                similarity(
                    t.title,
                    $1
                ) >= 0.20

                OR

                similarity(
                    t.description,
                    $2
                ) >= 0.20

                OR

                t.asset_id = $3
            )

            ORDER BY similarity_score DESC

            LIMIT 10;
            `,
            [
                current.title,
                current.description,
                current.asset_id,
                id
            ]
        );


        return res.json({
            ticket_id: Number(id),
            similar_tickets: result.rows
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error:
                "Unable to find similar incidents"
        });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    getTicketHistory,
    getTicketStatistics,
    findSimilarTickets
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