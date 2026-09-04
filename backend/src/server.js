require("dotenv").config();

const express  = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req, res)=>{
    res.json({
        message: "IT Helpdek API running"
    });
});

// 8. Import the ticket routing module from the routes directory
const ticketRoutes = require("./routes/ticketRoutes");

// 9. Mount ticketRoutes under the '/api/tickets' base path
// Example: router.post('/') in ticketRoutes.js becomes POST /api/tickets
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    // console.log(app);
});

