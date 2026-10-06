// 1. Import the main Express library into this file
const express = require('express');

// 2. Create a mini route-management object specifically for this file
const router = express.Router();

// 3. Import the specific function that handles the ticket creation logic from the controller
const {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    getTicketHistory,
    getTicketStatistics,
    findSimilarTickets
} = require("../controllers/ticketController");

// 4. Define a POST route at the base path ('/') and hand off requests to the createTicket function




// =========================================================
// IMPORTANT:
// More specific routes must come before /:id
// =========================================================

router.get("/", getAllTickets);

router.post("/", createTicket);

router.get("/statistics", getTicketStatistics);

router.get("/:id/history", getTicketHistory);


router.get("/:id", getTicketById);

router.get(
    "/:id/similar",
    findSimilarTickets
);

router.patch("/:id/status", updateTicketStatus);


module.exports = router;

// The Restaurant Analogy
// Imagine your main building (server.js) has a sign on the door pointing to a specific room: "Department for Tickets" (/api/tickets).
// Once a customer walks inside that room, they are already at the Ticket Department.

// The main counter inside that room is '/' (the starting point of that department).

// So, a customer walking up to that main counter (/) is making a request to /api/tickets + / = /api/tickets.

