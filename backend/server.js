require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();

// =======================================
// MIDDLEWARE
// =======================================

// Allow requests from frontend
app.use(cors());

// Allow JSON request body
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// =======================================
// HOME ROUTE
// =======================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "WoodShop Backend is Running..."
    });
});

// =======================================
// DATABASE TEST
// =======================================

app.get("/db-test", (req, res) => {

    connection.query("SELECT 1 AS test", (err, results) => {

        if (err) {

            console.error("❌ Database connection error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }

        res.json({
            success: true,
            message: "Database connected successfully",
            result: results
        });

    });

});

// =======================================
// SAVE BILL
// =======================================

// =======================================
// SAVE BILL
// =======================================

app.post("/save-bill", (req, res) => {

    const bill = req.body;

    console.log("======================================");
    console.log("SAVE BILL REQUEST");
    console.log(bill);
    console.log("======================================");

    // Basic validation
    if (!bill.billNo) {
        return res.status(400).json({
            success: false,
            message: "Bill number is missing"
        });
    }

    const sql = `
        INSERT INTO bills
        (
            bill_no,
            customer_id,
            customer_name,
            customer_mobile,
            customer_place,
            bill_date,
            bill_time,
            payment_type,
            advance_amount,
            balance_amount,
            total_cft,
            wood_total,
            labour_charge,
            other_charge,
            others_total,
            grand_total,
            wood_data,
            others_data
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [

        bill.billNo,
        bill.customerId,

        bill.customerName || "",
        bill.customerMobile || "",
        bill.customerPlace || "",

        bill.billDate,
        bill.billTime,

        bill.paymentType || "",

        Number(bill.advanceAmount) || 0,
        Number(bill.balanceAmount) || 0,

        Number(bill.totalCFT) || 0,
        Number(bill.woodTotal) || 0,
        Number(bill.labourCharge) || 0,
        Number(bill.otherCharge) || 0,
        Number(bill.othersTotal) || 0,
        Number(bill.grandTotal) || 0,

        JSON.stringify(bill.woodData || []),
        JSON.stringify(bill.othersData || [])

    ];

    connection.query(sql, values, (err, result) => {

        if (err) {

            console.error("======================================");
            console.error("❌ SAVE BILL DATABASE ERROR");
            console.error(err);
            console.error("SQL MESSAGE:", err.message);
            console.error("SQL CODE:", err.code);
            console.error("======================================");

            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message,
                code: err.code
            });
        }

        console.log("✅ Bill saved successfully");
        console.log("Bill ID:", result.insertId);
        console.log("Bill No:", bill.billNo);

        res.json({
            success: true,
            message: "Bill Saved Successfully",
            billId: result.insertId,
            billNo: bill.billNo
        });

    });

});

    // =======================================
    // BILL NUMBER
    // =======================================
    // Temporary empty value.
    // MySQL ID will decide the actual bill number.
    const values = [

        "",

        bill.customerId,
        bill.customerName,
        bill.customerMobile,
        bill.customerPlace,
        bill.billDate,
        bill.billTime,
        bill.paymentType,
        bill.advanceAmount,
        bill.balanceAmount,
        bill.totalCFT,
        bill.woodTotal,
        bill.labourCharge,
        bill.otherCharge,
        bill.othersTotal,
        bill.grandTotal,
        JSON.stringify(bill.woodData || []),
        JSON.stringify(bill.othersData || [])

    ];

    connection.query(sql, values, (err, result) => {

        if (err) {

            console.error("❌ Save bill error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        // =======================================
        // MYSQL AUTO_INCREMENT ID
        // =======================================

        const billId = result.insertId;

        // Example:
        // ID 1  -> 001
        // ID 25 -> 025
        // ID 100 -> 100

        const billNo = billId
            .toString()
            .padStart(3, "0");


        // =======================================
        // SAVE BILL NUMBER
        // =======================================

        const updateSql = `
            UPDATE bills
            SET bill_no = ?
            WHERE id = ?
        `;

        connection.query(
            updateSql,
            [billNo, billId],
            (updateErr) => {

                if (updateErr) {

                    console.error("❌ Bill number update error:");
                    console.error(updateErr);

                    return res.status(500).json({
                        success: false,
                        message: "Bill Number Update Failed"
                    });
                }

                // =======================================
                // SUCCESS
                // =======================================

                res.json({
                    success: true,
                    message: "Bill Saved Successfully",
                    billId: billId,
                    billNo: billNo
                });

            }
        );

    });

});

// =======================================
// GET ALL BILLS
// =======================================

app.get("/bills", (req, res) => {

    const sql = `
        SELECT *
        FROM bills
        ORDER BY id DESC
    `;

    connection.query(sql, (err, results) => {

        if (err) {

            console.error("❌ Get bills error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json(results);

    });

});

// =======================================
// GET PENDING BILLS
// =======================================

app.get("/pending-bills", (req, res) => {

    const sql = `
        SELECT
            id,
            bill_no,
            customer_id,
            customer_name,
            customer_mobile,
            customer_place,
            bill_date,
            advance_amount,
            balance_amount,
            grand_total,
            remark
        FROM bills
        WHERE balance_amount > 1
        ORDER BY id DESC
    `;

    connection.query(sql, (err, results) => {

        if (err) {

            console.error("❌ Get pending bills error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json(results);

    });

});

// =======================================
// GET SINGLE BILL
// =======================================

app.get("/bill/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM bills
        WHERE id = ?
    `;

    connection.query(sql, [id], (err, results) => {

        if (err) {

            console.error("❌ Get single bill error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Bill Not Found"
            });
        }

        res.json(results[0]);

    });

});

// =======================================
// UPDATE PENDING BILL
// =======================================

app.put("/update-pending", (req, res) => {

    const { id, paidAmount } = req.body;

    // Check input
    if (!id || paidAmount === undefined) {

        return res.status(400).json({
            success: false,
            message: "Bill ID and paid amount are required"
        });
    }

    const payment = Number(paidAmount);

    // Check payment
    if (isNaN(payment) || payment <= 0) {

        return res.status(400).json({
            success: false,
            message: "Paid amount must be greater than 0"
        });
    }

    // Get current bill
    connection.query(
        `
        SELECT
            advance_amount,
            balance_amount
        FROM bills
        WHERE id = ?
        `,
        [id],
        (err, results) => {

            if (err) {

                console.error("❌ Select pending bill error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Bill Not Found"
                });
            }

            const advance = Number(results[0].advance_amount);
            const balance = Number(results[0].balance_amount);

            const newAdvance = advance + payment;

            const newBalance =
                balance - payment < 0
                    ? 0
                    : balance - payment;

            // Update bill
            connection.query(
                `
                UPDATE bills
                SET
                    advance_amount = ?,
                    balance_amount = ?
                WHERE id = ?
                `,
                [
                    newAdvance,
                    newBalance,
                    id
                ],
                (err2) => {

                    if (err2) {

                        console.error("❌ Update pending bill error:");
                        console.error(err2);

                        return res.status(500).json({
                            success: false,
                            message: "Database Error"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Payment Updated Successfully",
                        advanceAmount: newAdvance,
                        balanceAmount: newBalance
                    });

                }
            );

        }
    );

});

// =======================================
// UPDATE REMARK
// =======================================

app.post("/update-remark", (req, res) => {

    const { id, remark } = req.body;

    if (!id) {

        return res.status(400).json({
            success: false,
            message: "Bill ID is required"
        });
    }

    const sql = `
        UPDATE bills
        SET remark = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [remark, id],
        (err, result) => {

            if (err) {

                console.error("❌ Update remark error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                message: "Remark Saved Successfully"
            });

        }
    );

});

// =======================================
// 404 ROUTE
// =======================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});

// =======================================
// ERROR HANDLER
// =======================================

app.use((err, req, res, next) => {

    console.error("❌ Server Error:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

// =======================================
// START SERVER
// =======================================

// =======================================
// SERVER START / VERCEL EXPORT
// =======================================

// Run server locally only
if (require.main === module) {

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {

        console.log("======================================");
        console.log("🚀 WOODSHOP BACKEND STARTED");
        console.log("======================================");
        console.log(`🚀 Server running on port ${PORT}`);
        console.log("======================================");

    });

}

// Export Express app for Vercel
module.exports = app;
