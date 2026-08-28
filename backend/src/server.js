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

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    console.log(app);
});