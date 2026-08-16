require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

// Allow frontend requests
app.use(cors());

// Allow JSON request body
app.use(express.json());

// Serve backend static files
app.use(express.static(path.join(__dirname)));


// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "WoodShop Backend is Running..."
    });

});


// ======================================================
// DATABASE TEST
// ======================================================

app.get("/db-test", (req, res) => {

    connection.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error(
                    "DATABASE CONNECTION ERROR:"
                );

                console.error(err);

                return res.status(500).json({

                    success: false,

                    message:
                        "Database connection failed",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                message:
                    "Database connected successfully",

                result:
                    results

            });

        }
    );

});


// ======================================================
// SAVE BILL
// ======================================================

app.post("/save-bill", (req, res) => {

    const bill = req.body;


    console.log("======================================");
    console.log("SAVE BILL REQUEST");
    console.log("======================================");

    console.log(bill);


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!bill) {

        return res.status(400).json({

            success: false,

            message:
                "Bill data is required"

        });

    }


    // ==================================================
    // GET NEXT BILL NUMBER
    // ==================================================

    const getBillNumberSQL = `
        SELECT COALESCE(MAX(id), 0) + 1 AS next_number
        FROM bills
    `;


    connection.query(
        getBillNumberSQL,
        (numberError, numberResult) => {

            if (numberError) {

                console.error(
                    "======================================"
                );

                console.error(
                    "BILL NUMBER GENERATION ERROR"
                );

                console.error(
                    "======================================"
                );

                console.error(numberError);


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not generate bill number",

                    error:
                        numberError.message,

                    code:
                        numberError.code

                });

            }


            // ==================================================
            // CREATE BILL NUMBER
            // ==================================================

            const nextNumber =
                Number(
                    numberResult[0].next_number
                ) || 1;


            const billNo =
                "BILL-" +
                String(nextNumber)
                    .padStart(4, "0");


            console.log(
                "Generated Bill Number:",
                billNo
            );


            // ==================================================
            // CUSTOMER ID
            // ==================================================

            let customerId =
                bill.customerId;


            if (!customerId) {

                customerId =
                    "CUST-" +
                    String(nextNumber)
                        .padStart(4, "0");

            }


            console.log(
                "Customer ID:",
                customerId
            );


            // ==================================================
            // PREPARE BILL VALUES
            // ==================================================

            const customerName =
                bill.customerName || "";


            const customerMobile =
                bill.customerMobile || "";


            const customerPlace =
                bill.customerPlace || "";


            const billDate =
                bill.billDate || null;


            const billTime =
                bill.billTime || null;


            const paymentType =
                bill.paymentType || "";


            const advanceAmount =
                Number(
                    bill.advanceAmount
                ) || 0;


            const balanceAmount =
                Number(
                    bill.balanceAmount
                ) || 0;


            const totalCFT =
                Number(
                    bill.totalCFT
                ) || 0;


            const woodTotal =
                Number(
                    bill.woodTotal
                ) || 0;


            const labourCharge =
                Number(
                    bill.labourCharge
                ) || 0;


            const otherCharge =
                Number(
                    bill.otherCharge
                ) || 0;


            const othersTotal =
                Number(
                    bill.othersTotal
                ) || 0;


            const grandTotal =
                Number(
                    bill.grandTotal
                ) || 0;


            const woodData =
                JSON.stringify(
                    bill.woodData || []
                );


            const othersData =
                JSON.stringify(
                    bill.othersData || []
                );


            const remark =
                bill.remark || "";


            // ==================================================
            // INSERT BILL
            // ==================================================

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
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )

            `;


            // ==================================================
            // VALUES ARRAY
            // ==================================================

            const values = [

                billNo,

                customerId,

                customerName,

                customerMobile,

                customerPlace,

                billDate,

                billTime,

                paymentType,

                advanceAmount,

                balanceAmount,

                totalCFT,

                woodTotal,

                labourCharge,

                otherCharge,

                othersTotal,

                grandTotal,

                woodData,

                othersData,

                remark

            ];


            // ==================================================
            // DATABASE INSERT
            // ==================================================

            connection.query(
                sql,
                values,
                (err, result) => {

                    if (err) {

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "DATABASE SAVE ERROR"
                        );

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "Message:",
                            err.message
                        );

                        console.error(
                            "Code:",
                            err.code
                        );

                        console.error(
                            "SQL:",
                            sql
                        );

                        console.error(
                            "Values:",
                            values
                        );

                        console.error(
                            "======================================"
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                err.message,

                            code:
                                err.code

                        });

                    }


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    console.log(
                        "======================================"
                    );

                    console.log(
                        "BILL SAVED SUCCESSFULLY"
                    );

                    console.log(
                        "======================================"
                    );

                    console.log(
                        "Bill ID:",
                        result.insertId
                    );

                    console.log(
                        "Bill Number:",
                        billNo
                    );

                    console.log(
                        "Customer ID:",
                        customerId
                    );

                    console.log(
                        "======================================"
                    );


                    return res.json({

                        success: true,

                        message:
                            "Bill Saved Successfully",

                        billId:
                            result.insertId,

                        billNo:
                            billNo,

                        customerId:
                            customerId

                    });

                }
            );

        }
    );

});


// ======================================================
// GET ALL BILLS
// ======================================================

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

                console.error(
                    "GET ALL BILLS ERROR:"
                );

                console.error(err);


                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// ======================================================
// GET PENDING BILLS
// ======================================================

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

                console.error(
                    "GET PENDING BILLS ERROR:"
                );

                console.error(err);


                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// ======================================================
// GET SINGLE BILL
// ======================================================

app.get("/bill/:id", (req, res) => {

    const id =
        req.params.id;


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

                console.error(
                    "GET SINGLE BILL ERROR:"
                );

                console.error(err);


                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            if (results.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            res.json({

                success: true,

                bill:
                    results[0]

            });

        }
    );

});


// ======================================================
// UPDATE PENDING BILL PAYMENT
// ======================================================

app.put("/update-pending", (req, res) => {

    const {
        id,
        paidAmount
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        !id ||
        paidAmount === undefined
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID and paid amount are required"

        });

    }


    const payment =
        Number(paidAmount);


    if (
        isNaN(payment) ||
        payment <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Paid amount must be greater than 0"

        });

    }


    // ==================================================
    // GET CURRENT PAYMENT
    // ==================================================

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

                console.error(
                    "SELECT PENDING BILL ERROR:"
                );

                console.error(err);


                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            // ==================================================
            // OLD VALUES
            // ==================================================

            const advance =
                Number(
                    results[0].advance_amount
                ) || 0;


            const balance =
                Number(
                    results[0].balance_amount
                ) || 0;


            // ==================================================
            // NEW VALUES
            // ==================================================

            const newAdvance =
                advance + payment;


            const newBalance =
                Math.max(
                    balance - payment,
                    0
                );


            // ==================================================
            // UPDATE
            // ==================================================

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

                        console.error(
                            "UPDATE PENDING BILL ERROR:"
                        );

                        console.error(
                            updateError
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                updateError.message,

                            code:
                                updateError.code

                        });

                    }


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    res.json({

                        success: true,

                        message:
                            "Payment Updated Successfully",

                        advanceAmount:
                            newAdvance,

                        balanceAmount:
                            newBalance

                    });

                }
            );

        }
    );

});


// ======================================================
// UPDATE REMARK
// ======================================================

app.post("/update-remark", (req, res) => {

    const {
        id,
        remark
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!id) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID is required"

        });

    }


    // ==================================================
    // SQL
    // ==================================================

    const sql = `

        UPDATE bills

        SET remark = ?

        WHERE id = ?

    `;


    connection.query(
        sql,
        [
            remark || "",
            id
        ],
        (err) => {

            if (err) {

                console.error(
                    "UPDATE REMARK ERROR:"
                );

                console.error(err);


                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                message:
                    "Remark Saved Successfully"

            });

        }
    );

});


// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API route not found",

        path:
            req.originalUrl

    });

});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "======================================"
        );

        console.error(
            "SERVER ERROR"
        );

        console.error(
            "======================================"
        );

        console.error(err);


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }
);


// ======================================================
// LOCAL DEVELOPMENT SERVER
// ======================================================

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;


    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                "======================================"
            );

            console.log(
                "WOODSHOP BACKEND STARTED"
            );

            console.log(
                "======================================"
            );

            console.log(
                "Server running on port:",
                PORT
            );

            console.log(
                "======================================"
            );

        }
    );

}


// ======================================================
// VERCEL
// ======================================================

module.exports = app;
