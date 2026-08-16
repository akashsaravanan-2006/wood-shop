// =========================================
// WOOD SHOP BACKEND - SERVER.JS
// =========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connection = require("./db");

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname)));


// =========================================
// HOME / SERVER TEST
// =========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Wood Shop Backend is running"
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

                console.error(
                    "DATABASE TEST ERROR:",
                    err
                );

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

            return res.json({

                success: true,

                message:
                    "Database connected successfully",

                result:
                    results

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
    // CHECK BILL DATA
    // =====================================

    if (!bill) {

        return res.status(400).json({

            success: false,

            message:
                "Bill data is missing"

        });

    }


    // =====================================
    // GET LAST BILL NUMBER
    // =====================================
    //
    // IMPORTANT:
    // We do NOT use database ID here.
    //
    // Bill number is generated from bill_no.
    //
    // Example:
    // BILL-0001
    // BILL-0002
    // BILL-0003
    //
    // =====================================

    const getLastBillSql = `
        SELECT
            MAX(
                CAST(
                    SUBSTRING(bill_no, 6)
                    AS UNSIGNED
                )
            ) AS last_number
        FROM bills
        WHERE bill_no LIKE 'BILL-%'
    `;


    connection.query(
        getLastBillSql,
        (billError, billResults) => {

            if (billError) {

                console.error(
                    "======================================"
                );

                console.error(
                    "GET LAST BILL NUMBER ERROR"
                );

                console.error(
                    "Message:",
                    billError.message
                );

                console.error(
                    "Code:",
                    billError.code
                );

                console.error(
                    "SQL State:",
                    billError.sqlState
                );

                console.error(
                    "======================================"
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not generate bill number",

                    error:
                        billError.message,

                    code:
                        billError.code

                });

            }


            // =====================================
            // GENERATE NEXT NUMBER
            // =====================================

            let nextNumber = 1;


            if (
                billResults &&
                billResults.length > 0 &&
                billResults[0].last_number !== null
            ) {

                nextNumber =
                    Number(
                        billResults[0].last_number
                    ) + 1;

            }


            // =====================================
            // BILL NUMBER
            // =====================================

            const billNo =
                "BILL-" +
                String(nextNumber).padStart(4, "0");


            // =====================================
            // CUSTOMER ID
            // =====================================

            const customerId =
                "CUST-" +
                String(nextNumber).padStart(4, "0");


            console.log(
                "Generated Bill Number:",
                billNo
            );

            console.log(
                "Generated Customer ID:",
                customerId
            );


            // =====================================
            // CUSTOMER INFORMATION
            // =====================================

            const customerName =
                bill.customerName || "";

            const customerMobile =
                bill.customerMobile || "";

            const customerPlace =
                bill.customerPlace || "";


            // =====================================
            // DATE
            // =====================================

            const billDate =
                bill.billDate || null;


            // =====================================
            // TIME
            // =====================================

            const billTime =
                bill.billTime || null;


            // =====================================
            // PAYMENT TYPE
            // =====================================

            const paymentType =
                bill.paymentType || "";


            // =====================================
            // AMOUNTS
            // =====================================

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


            // =====================================
            // WOOD DATA
            // =====================================

            let woodData = "[]";


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


            // =====================================
            // OTHERS DATA
            // =====================================

            let othersData = "[]";


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


            // =====================================
            // INSERT BILL
            // =====================================

            const insertSql = `

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


            // =====================================
            // EXECUTE INSERT
            // =====================================

            connection.query(
                insertSql,
                values,
                (insertError, result) => {


                    // =================================
                    // DATABASE ERROR
                    // =================================

                    if (insertError) {

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "INSERT BILL ERROR"
                        );

                        console.error(
                            "Message:",
                            insertError.message
                        );

                        console.error(
                            "Code:",
                            insertError.code
                        );

                        console.error(
                            "SQL State:",
                            insertError.sqlState
                        );

                        console.error(
                            "======================================"
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                insertError.message,

                            code:
                                insertError.code

                        });

                    }


                    // =================================
                    // SUCCESS
                    // =================================

                    console.log(
                        "======================================"
                    );

                    console.log(
                        "BILL SAVED SUCCESSFULLY"
                    );

                    console.log(
                        "Database ID:",
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
                    "GET BILLS ERROR:",
                    err
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


            return res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// =========================================
// GET SINGLE BILL
// =========================================

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
                    "GET SINGLE BILL ERROR:",
                    err
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


            return res.json({

                success: true,

                bill:
                    results[0]

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
                    "GET PENDING BILLS ERROR:",
                    err
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


            return res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// =========================================
// UPDATE PENDING BILL PAYMENT
// =========================================

app.put("/update-pending", (req, res) => {

    const id =
        req.body.id;


    const paidAmount =
        Number(
            req.body.paidAmount
        );


    // =====================================
    // VALIDATION
    // =====================================

    if (!id) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID is required"

        });

    }


    if (
        isNaN(paidAmount) ||
        paidAmount <= 0
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
                    "GET PAYMENT DATA ERROR:",
                    err
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


            // =================================
            // CURRENT VALUES
            // =================================

            const currentAdvance =
                Number(
                    results[0].advance_amount
                ) || 0;


            const currentBalance =
                Number(
                    results[0].balance_amount
                ) || 0;


            // =================================
            // NEW VALUES
            // =================================

            const newAdvance =
                currentAdvance +
                paidAmount;


            const newBalance =
                Math.max(
                    currentBalance -
                    paidAmount,
                    0
                );


            // =================================
            // UPDATE DATABASE
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
                            "UPDATE PAYMENT ERROR:",
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


                    return res.json({

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

    const id =
        req.body.id;


    const remark =
        req.body.remark || "";


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
            remark,
            id
        ],
        (err) => {

            if (err) {

                console.error(
                    "UPDATE REMARK ERROR:",
                    err
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


            return res.json({

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

    return res.status(404).json({

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


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }
);


// =========================================
// LOCAL DEVELOPMENT SERVER
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
                "WOOD SHOP BACKEND STARTED"
            );

            console.log(
                "PORT:",
                PORT
            );

            console.log(
                "======================================"
            );

        }
    );

}


// =========================================
// VERCEL
// =========================================

module.exports = app;
