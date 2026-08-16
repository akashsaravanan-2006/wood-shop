require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();

// =======================================
// MIDDLEWARE
// =======================================

app.use(cors());
app.use(express.json());

// Serve backend files
app.use(express.static(path.join(__dirname)));

// =======================================
// HOME
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

    connection.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error("Database connection error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database connection failed",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Database connected successfully",
                result: results
            });
        }
    );
});

// =======================================
// SAVE BILL
// =======================================

app.post("/save-bill", (req, res) => {

    const bill = req.body;

    console.log("======================================");
    console.log("SAVE BILL REQUEST");
    console.log("======================================");
    console.log(bill);

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (!bill.customerId) {

        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }

    // ---------------------------------------
    // GET NEXT BILL NUMBER
    // ---------------------------------------

    
     // ---------------------------------------
// GET NEXT BILL NUMBER
// ---------------------------------------

// Use AUTO_INCREMENT id from bills table.
// First bill = BILL-0001
// Second bill = BILL-0002
// Third bill = BILL-0003

const getBillNumberSQL = `
    SELECT COALESCE(MAX(id), 0) + 1 AS next_number
    FROM bills
`;

connection.query(
    getBillNumberSQL,
    (numberError, numberResult) => {

        if (numberError) {

            console.error("Bill number generation error:");
            console.error(numberError);

            return res.status(500).json({
                success: false,
                message: "Could not generate bill number",
                error: numberError.message
            });
        }

        const nextNumber =
            Number(numberResult[0].next_number) || 1;

        const billNo =
            "BILL-" +
            String(nextNumber).padStart(4, "0");

        console.log(
            "Generated Bill Number:",
            billNo
        );

            // ---------------------------------------
            // BILL NUMBER
            // ---------------------------------------

            const nextNumber =
                Number(numberResult[0].next_number) || 1;

            const billNo =
                "BILL-" +
                String(nextNumber).padStart(4, "0");

            console.log("Generated Bill Number:", billNo);

            // ---------------------------------------
            // SQL
            // ---------------------------------------

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
                    others_data,
                    remark
                )
                VALUES
                (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?
                )
            `;

            // ---------------------------------------
            // VALUES
            // ---------------------------------------

            const values = [

                billNo,

                bill.customerId || null,
                bill.customerName || null,
                bill.customerMobile || null,
                bill.customerPlace || null,

                bill.billDate || null,
                bill.billTime || null,

                bill.paymentType || null,

                Number(bill.advanceAmount) || 0,
                Number(bill.balanceAmount) || 0,

                Number(bill.totalCFT) || 0,
                Number(bill.woodTotal) || 0,

                Number(bill.labourCharge) || 0,
                Number(bill.otherCharge) || 0,

                Number(bill.othersTotal) || 0,
                Number(bill.grandTotal) || 0,

                JSON.stringify(bill.woodData || []),
                JSON.stringify(bill.othersData || []),

                bill.remark || ""
            ];

            // ---------------------------------------
            // INSERT
            // ---------------------------------------

            connection.query(
                sql,
                values,
                (err, result) => {

                    if (err) {

                        console.error("======================================");
                        console.error("DATABASE SAVE ERROR");
                        console.error("======================================");
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Database Error",
                            error: err.message
                        });
                    }

                    console.log("======================================");
                    console.log("BILL SAVED SUCCESSFULLY");
                    console.log("Bill ID:", result.insertId);
                    console.log("Bill Number:", billNo);
                    console.log("======================================");

                    res.json({
                        success: true,
                        message: "Bill Saved Successfully",
                        billId: result.insertId,
                        billNo: billNo
                    });
                }
            );
        }
    );
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

    connection.query(
        sql,
        (err, results) => {

            if (err) {

                console.error("Get bills error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            res.json({
                success: true,
                bills: results
            });
        }
    );
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

    connection.query(
        sql,
        (err, results) => {

            if (err) {

                console.error("Get pending bills error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            res.json({
                success: true,
                bills: results
            });
        }
    );
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

    connection.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.error("Get single bill error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Bill Not Found"
                });
            }

            res.json({
                success: true,
                bill: results[0]
            });
        }
    );
});

// =======================================
// UPDATE PENDING BILL
// =======================================

app.put("/update-pending", (req, res) => {

    const { id, paidAmount } = req.body;

    if (!id || paidAmount === undefined) {

        return res.status(400).json({
            success: false,
            message: "Bill ID and paid amount are required"
        });
    }

    const payment = Number(paidAmount);

    if (isNaN(payment) || payment <= 0) {

        return res.status(400).json({
            success: false,
            message: "Paid amount must be greater than 0"
        });
    }

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

                console.error("Select pending bill error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Bill Not Found"
                });
            }

            const advance =
                Number(results[0].advance_amount) || 0;

            const balance =
                Number(results[0].balance_amount) || 0;

            const newAdvance =
                advance + payment;

            const newBalance =
                Math.max(balance - payment, 0);

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
                (updateError) => {

                    if (updateError) {

                        console.error("Update pending bill error:");
                        console.error(updateError);

                        return res.status(500).json({
                            success: false,
                            message: "Database Error",
                            error: updateError.message
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
        [remark || "", id],
        (err) => {

            if (err) {

                console.error("Update remark error:");
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
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
// 404
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

    console.error("Server Error:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

// =======================================
// LOCAL SERVER
// =======================================

if (require.main === module) {

    const PORT = process.env.PORT || 5000;

    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log("======================================");
            console.log("WOODSHOP BACKEND STARTED");
            console.log("======================================");
            console.log(`Server running on port ${PORT}`);
            console.log("======================================");
        }
    );
}

// =======================================
// VERCEL
// =======================================

module.exports = app;
