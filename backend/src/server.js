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




// No, backend routes **must stay in Express alongside controllers**. Controllers and backend routes are two sides of the same coin—you cannot put backend API routes into React while leaving controllers in Express.

// Here is how they actually connect and why they cannot be split across the frontend and backend:

// ### Why Backend Routes Belong in Express

// A **route** in Express is simply a URL listener (`router.get("/api/tickets", ...)`). It acts as the bridge that matches incoming HTTP requests to their corresponding **controller function**.

// Because Express controllers run on Node.js to execute SQL queries or business rules, the route pointing to that controller must also live in Node.js.

// ```text
// [ Browser / React ]  ──( HTTP Request )──>  [ Express Router ] ──> [ Express Controller ] ──> [ PostgreSQL ]

// ```

// If you put backend API routes directly inside React, React would have no way to execute your Express controllers because Node.js server code cannot run inside a user's web browser.

// ---

// ### Clarifying the Two Types of "Routes"

// To clear up the confusion, full-stack applications use **two completely separate routing systems**:

// | Route Type | Where It Lives | What It Controls | Example |
// | --- | --- | --- | --- |
// | **Backend API Routes** | Express (`backend/src/routes/`) | Maps HTTP requests (`GET`, `POST`) to **Express Controllers** to fetch or update database data. | `router.get("/api/tickets", getAllTickets)` |
// | **Frontend UI Routes** | React Router (`frontend/src/`) | Maps browser URL paths to **React Components** to change what screen the user sees. | `<Route element="{<Dashboard" path="/dashboard"/>} />` |

// ---

// ### How They Work Together

// 1. **User action:** A user navigates to `/dashboard` in their browser.
// 2. **Frontend Route (React):** React Router catches the `/dashboard` URL and renders the `<Dashboard/>` component.
// 3. **HTTP Fetch:** Inside that component, React sends an HTTP `GET` request to `http://localhost:5000/api/tickets`.
// 4. **Backend Route (Express):** Express catches the `GET /api/tickets` route and passes execution to your `getAllTickets` controller.
// 5. **Controller:** The controller runs the SQL query against PostgreSQL and sends back raw JSON data for React to render.