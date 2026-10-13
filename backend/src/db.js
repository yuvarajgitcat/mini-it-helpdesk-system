const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Without this handler, an error on an idle connection (e.g. the database
// pod being replaced) is an unhandled 'error' event and crashes the process.
pool.on("error", (err) => {
    console.error("Idle database client error (pool will reconnect):", err.message);
});

module.exports = pool;