// =========================================
// WOOD SHOP BACKEND - SERVER.JS
// =========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));


// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "WoodShop Backend is Running..."
    });

});


// =========================================
// DATABASE TEST
// =========================================

app.get("/db-test", (req, res) => {

    connection.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error("======================================");
                console.error("DATABASE CONNECTION ERROR");
                console.error(err);
                console.error("======================================");

                return res.status(500).json({
                    success: false,
                    message: "Database connection failed",
                    error: err.message,
                    code: err.code
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


// =========================================
// SAVE BILL
// =========================================

app.post("/save-bill", (req, res) => {

    const bill = req.body;

    console.log("======================================");
    console.log("SAVE BILL REQUEST");
    console.log(bill);
    console.log("======================================");


    // =====================================
    // BASIC VALIDATION
    // =====================================

    if (!bill) {

        return res.status(400).json({
            success: false,
            message: "Bill data is missing"
        });

    }


    // =====================================
    // GENERATE NEXT BILL NUMBER
    // =====================================
    //
    // Empty table:
    // BILL-0001
    //
    // Existing:
    // BILL-0001
    // BILL-0002
    //
    // Next:
    // BILL-0003
    //
    // =====================================

    const billNumberSql = `
        SELECT
            COALESCE(
                MAX(
                    CAST(
                        SUBSTRING_INDEX(bill_no, '-', -1)
                        AS UNSIGNED
                    )
                ),
                0
            ) AS max_number
        FROM bills
        WHERE bill_no LIKE 'BILL-%'
    `;


    connection.query(
        billNumberSql,
        (numberError, numberResults) => {

            if (numberError) {

                console.error("======================================");
                console.error("BILL NUMBER DATABASE ERROR");
                console.error("Message:", numberError.message);
                console.error("Code:", numberError.code);
                console.error("======================================");

                return res.status(500).json({
                    success: false,
                    message: "Could not generate bill number",
                    error: numberError.message,
                    code: numberError.code
                });

            }


            // =================================
            // GET LAST BILL NUMBER
            // =================================

            let lastNumber = 0;

            if (
                numberResults &&
                numberResults.length > 0
            ) {

                lastNumber =
                    Number(numberResults[0].max_number) || 0;

            }


            // =================================
            // NEXT BILL NUMBER
            // =================================

            const nextNumber = lastNumber + 1;


            // =================================
            // CREATE BILL NUMBER
            // =================================

            const billNo =
                "BILL-" +
                String(nextNumber).padStart(4, "0");


            // =================================
            // CUSTOMER ID
            // =================================
            //
            // If frontend sends customer ID,
            // use it.
            //
            // Otherwise create:
            // CUST-0001
            //
            // =================================

            let customerId = bill.customerId;

            if (!customerId) {

                customerId =
                    "CUST-" +
                    String(nextNumber).padStart(4, "0");

            }


            console.log("======================================");
            console.log("GENERATED BILL");
            console.log("Bill Number :", billNo);
            console.log("Customer ID :", customerId);
            console.log("======================================");


            // =================================
            // PREPARE CUSTOMER DATA
            // =================================

            const customerName =
                bill.customerName || "";

            const customerMobile =
                bill.customerMobile || "";

            const customerPlace =
                bill.customerPlace || "";


            // =================================
            // DATE & TIME
            // =================================

            const billDate =
                bill.billDate || null;

            const billTime =
                bill.billTime || null;


            // =================================
            // PAYMENT TYPE
            // =================================

            const paymentType =
                bill.paymentType || "";


            // =================================
            // AMOUNTS
            // =================================

            const advanceAmount =
                Number(bill.advanceAmount) || 0;

            const balanceAmount =
                Number(bill.balanceAmount) || 0;

            const totalCFT =
                Number(bill.totalCFT) || 0;

            const woodTotal =
                Number(bill.woodTotal) || 0;

            const labourCharge =
                Number(bill.labourCharge) || 0;

            const otherCharge =
                Number(bill.otherCharge) || 0;

            const othersTotal =
                Number(bill.othersTotal) || 0;

            const grandTotal =
                Number(bill.grandTotal) || 0;


            // =================================
            // JSON DATA
            // =================================

            let woodData = "[]";

            let othersData = "[]";


            try {

                woodData =
                    JSON.stringify(
                        bill.woodData || []
                    );

            } catch (error) {

                console.error(
                    "WOOD DATA JSON ERROR:",
                    error
                );

                woodData = "[]";

            }


            try {

                othersData =
                    JSON.stringify(
                        bill.othersData || []
                    );

            } catch (error) {

                console.error(
                    "OTHERS DATA JSON ERROR:",
                    error
                );

                othersData = "[]";

            }


            // =================================
            // INSERT BILL
            // =================================

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
                    ?
                )
            `;


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

                othersData

            ];


            // =================================
            // EXECUTE INSERT
            // =================================

            connection.query(
                sql,
                values,
                (err, result) => {

                    if (err) {

                        console.error("======================================");
                        console.error("SAVE BILL DATABASE ERROR");
                        console.error("Message:", err.message);
                        console.error("Code:", err.code);
                        console.error("SQL State:", err.sqlState);
                        console.error("======================================");

                        return res.status(500).json({

                            success: false,

                            message: "Database Error",

                            error: err.message,

                            code: err.code

                        });

                    }


                    // =================================
                    // SUCCESS
                    // =================================

                    console.log("======================================");
                    console.log("BILL SAVED SUCCESSFULLY");
                    console.log("Bill ID :", result.insertId);
                    console.log("Bill No :", billNo);
                    console.log("Customer ID :", customerId);
                    console.log("======================================");


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


// =========================================
// GET ALL BILLS
// =========================================

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
                    "GET ALL BILLS ERROR"
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

                bills: results

            });

        }
    );

});


// =========================================
// GET PENDING BILLS
// =========================================

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
                    "GET PENDING BILLS ERROR"
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

                bills: results

            });

        }
    );

});


// =========================================
// GET SINGLE BILL
// =========================================

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

                console.error(
                    "GET SINGLE BILL ERROR"
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
                !results ||
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            res.json({

                success: true,

                bill: results[0]

            });

        }
    );

});


// =========================================
// UPDATE PENDING BILL
// =========================================

app.put("/update-pending", (req, res) => {

    const {
        id,
        paidAmount
    } = req.body;


    // =====================================
    // VALIDATION
    // =====================================

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


    // =====================================
    // GET CURRENT BILL
    // =====================================

    const selectSql = `
        SELECT
            advance_amount,
            balance_amount
        FROM bills
        WHERE id = ?
    `;


    connection.query(
        selectSql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "SELECT PENDING BILL ERROR"
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
                !results ||
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            const advance =
                Number(
                    results[0].advance_amount
                ) || 0;


            const balance =
                Number(
                    results[0].balance_amount
                ) || 0;


            // =================================
            // CALCULATE NEW VALUES
            // =================================

            const newAdvance =
                advance + payment;


            const newBalance =
                Math.max(
                    balance - payment,
                    0
                );


            // =================================
            // UPDATE
            // =================================

            const updateSql = `
                UPDATE bills
                SET
                    advance_amount = ?,
                    balance_amount = ?
                WHERE id = ?
            `;


            connection.query(
                updateSql,
                [
                    newAdvance,
                    newBalance,
                    id
                ],
                (updateError) => {

                    if (updateError) {

                        console.error(
                            "UPDATE PENDING BILL ERROR"
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


// =========================================
// UPDATE REMARK
// =========================================

app.post("/update-remark", (req, res) => {

    const {
        id,
        remark
    } = req.body;


    if (!id) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID is required"

        });

    }


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
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE REMARK ERROR"
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


// =========================================
// 404 ROUTE
// =========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API route not found",

        path:
            req.originalUrl

    });

});


// =========================================
// ERROR HANDLER
// =========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:"
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


// =========================================
// LOCAL SERVER
// =========================================

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
                `Server running on port ${PORT}`
            );

            console.log(
                "======================================"
            );

        }
    );

}


// =========================================
// VERCEL EXPORT
// =========================================

module.exports = app;
