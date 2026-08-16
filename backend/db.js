const mysql = require("mysql2");

// =======================================
// TiDB CLOUD / MYSQL CONNECTION
// =======================================

const connection = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME || "woodshop",

    port: Number(process.env.DB_PORT) || 4000,

    // TiDB Cloud uses SSL
    ssl: {
        rejectUnauthorized: true
    },

    // Connection pool
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});

// =======================================
// TEST DATABASE CONNECTION
// =======================================

connection.query("SELECT 1 AS test", (err, results) => {

    if (err) {

        console.log("❌ TiDB Cloud Connection Failed");
        console.log(err.message);

        return;
    }

    console.log("======================================");
    console.log("✅ TiDB Cloud Connected Successfully");
    console.log("======================================");

});

// =======================================
// EXPORT CONNECTION
// =======================================

module.exports = connection;