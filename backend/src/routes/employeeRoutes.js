const express = require("express");

const router = express.Router();

const {
    getAllEmployees,
    getEmployeeTickets
} = require("../controllers/employeeController");


router.get("/", getAllEmployees);

router.get("/:id/tickets", getEmployeeTickets);


module.exports = router;