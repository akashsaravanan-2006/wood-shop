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
// HOME
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

                console.error("DATABASE TEST ERROR:");
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

    console.log("======================================");
    console.log("SAVE BILL REQUEST");
    console.log("======================================");

    const bill = req.body;

    console.log("Received Bill:");
    console.log(bill);


    // =====================================
    // CHECK DATA
    // =====================================

    if (!bill) {

        return res.status(400).json({

            success: false,

            message:
                "Bill data is missing"

        });

    }


    // =====================================
    // CUSTOMER DATA
    // =====================================

    const customerName =
        bill.customerName || "";

    const customerMobile =
        bill.customerMobile || "";

    const customerPlace =
        bill.customerPlace || "";


    // =====================================
    // DATE & TIME
    // =====================================

    const billDate =
        bill.billDate || null;

    const billTime =
        bill.billTime || null;


    // =====================================
    // PAYMENT
    // =====================================

    const paymentType =
        bill.paymentType || "";


    // =====================================
    // AMOUNTS
    // =====================================

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


    // =====================================
    // CUSTOMER ID
    // =====================================

    let customerId =
        bill.customerId || "";


    // =====================================
    // JSON DATA
    // =====================================

    let woodData = "[]";

    let othersData = "[]";


    try {

        woodData =
            JSON.stringify(
                Array.isArray(bill.woodData)
                    ? bill.woodData
                    : []
            );

    }

    catch (error) {

        console.error(
            "WOOD DATA JSON ERROR:",
            error
        );

        woodData = "[]";

    }


    try {

        othersData =
            JSON.stringify(
                Array.isArray(bill.othersData)
                    ? bill.othersData
                    : []
            );

    }

    catch (error) {

        console.error(
            "OTHERS DATA JSON ERROR:",
            error
        );

        othersData = "[]";

    }


    // =====================================
    // IMPORTANT
    // =====================================
    //
    // We DO NOT generate bill number
    // using MAX(), SUBSTRING(), CAST(), etc.
    //
    // We insert TEMP first.
    //
    // TiDB gives us AUTO_INCREMENT id.
    //
    // id 1  -> BILL-0001
    // id 2  -> BILL-0002
    // id 3  -> BILL-0003
    //
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

        "TEMP",

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
    // INSERT BILL
    // =====================================

    connection.query(
        insertSql,
        values,
        (insertError, result) => {

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
            // GET AUTO_INCREMENT ID
            // =================================

            const billId =
                Number(result.insertId);


            console.log(
                "Database ID:",
                billId
            );


            if (!billId || billId <= 0) {

                console.error(
                    "Invalid insertId:",
                    result.insertId
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not generate bill number"

                });

            }


            // =================================
            // GENERATE BILL NUMBER
            // =================================

            const billNo =
                "BILL-" +
                String(billId).padStart(4, "0");


            // =================================
            // GENERATE CUSTOMER ID
            // =================================

            if (!customerId) {

                customerId =
                    "CUST-" +
                    String(billId).padStart(4, "0");

            }


            console.log(
                "Generated Bill Number:",
                billNo
            );

            console.log(
                "Customer ID:",
                customerId
            );


            // =================================
            // UPDATE BILL NUMBER
            // =================================

            const updateSql = `

                UPDATE bills

                SET
                    bill_no = ?,
                    customer_id = ?

                WHERE id = ?

            `;


            connection.query(

                updateSql,

                [
                    billNo,
                    customerId,
                    billId
                ],

                (updateError) => {

                    if (updateError) {

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "BILL NUMBER UPDATE ERROR"
                        );

                        console.error(
                            updateError.message
                        );

                        console.error(
                            updateError.code
                        );

                        console.error(
                            "======================================"
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Bill Number Update Failed",

                            error:
                                updateError.message,

                            code:
                                updateError.code

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
                        "Bill ID:",
                        billId
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
                            billId,

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
        Number(req.body.paidAmount);


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


            const currentAdvance =
                Number(
                    results[0].advance_amount
                ) || 0;


            const currentBalance =
                Number(
                    results[0].balance_amount
                ) || 0;


            if (
                paidAmount >
                currentBalance
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Paid amount cannot be greater than balance"

                });

            }


            const newAdvance =
                currentAdvance +
                paidAmount;


            const newBalance =
                currentBalance -
                paidAmount;


            // =================================
            // UPDATE PAYMENT
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

                (updateErr) => {

                    if (updateErr) {

                        console.error(
                            "UPDATE PAYMENT ERROR:",
                            updateErr
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                updateErr.message,

                            code:
                                updateErr.code

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
// 404 API ROUTE
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
// EXPORT FOR VERCEL
// =========================================

module.exports = app;


// =========================================
// LOCAL DEVELOPMENT
// =========================================

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;

    app.listen(
        PORT,
        () => {

            console.log(
                `Wood Shop Backend running on port ${PORT}`
            );

        }
    );

}
