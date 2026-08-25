// ======================================================
// WOODSHOP BACKEND - SERVER.JS
// COMPLETE UPDATED VERSION
// ======================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

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
                    "DATABASE CONNECTION ERROR:",
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


    console.log(
        "======================================"
    );

    console.log(
        "SAVE BILL REQUEST"
    );

    console.log(
        "======================================"
    );

    console.log(
        JSON.stringify(
            bill,
            null,
            2
        )
    );


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!bill || typeof bill !== "object") {

        return res.status(400).json({

            success: false,

            message:
                "Bill data is required"

        });

    }


    // ==================================================
    // GENERATE BILL NUMBER + CUSTOMER ID
    // ==================================================

    const getNextNumberSQL = `

        SELECT COUNT(*) AS total
        FROM bills

    `;


    connection.query(
        getNextNumberSQL,
        (numberError, numberResult) => {

            if (numberError) {

                console.error(
                    "BILL NUMBER GENERATION ERROR:",
                    numberError
                );

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
            // NEXT NUMBER
            // ==================================================

            const totalBills =
                Number(
                    numberResult[0].total
                ) || 0;


            const nextNumber =
                totalBills + 1;


            // ==================================================
            // BILL NUMBER
            // ==================================================

            const billNo =
                "BILL-" +
                String(nextNumber)
                    .padStart(4, "0");


            // ==================================================
            // CUSTOMER ID
            // ==================================================

            const customerId =
                "CUST-" +
                String(nextNumber)
                    .padStart(4, "0");


            console.log(
                "Total Bills:",
                totalBills
            );

            console.log(
                "Next Number:",
                nextNumber
            );

            console.log(
                "Generated Bill Number:",
                billNo
            );

            console.log(
                "Generated Customer ID:",
                customerId
            );


            // ==================================================
            // CUSTOMER INFORMATION
            // ==================================================

            const customerName =
                bill.customerName || "";

            const customerMobile =
                bill.customerMobile || "";

            const customerPlace =
                bill.customerPlace || "";


            // ==================================================
            // DATE / TIME
            // ==================================================

            const billDate =
                bill.billDate || null;

            const billTime =
                bill.billTime || null;


            // ==================================================
            // PAYMENT TYPE
            //
            // cash
            // advance
            // ==================================================

            const paymentType =
                String(
                    bill.paymentType || ""
                ).trim();


            // ==================================================
            // PAYMENT MODE
            //
            // cash
            // upi
            // ==================================================

            const paymentMode =
                String(
                    bill.paymentMode || ""
                ).trim();


            // ==================================================
            // MONEY VALUES
            //
            // ALL MONEY = INTEGER
            // ==================================================

            const advanceAmount =
                Math.round(
                    Number(
                        bill.advanceAmount
                    ) || 0
                );


            const balanceAmount =
                Math.round(
                    Number(
                        bill.balanceAmount
                    ) || 0
                );


            // ==================================================
            // CFT
            //
            // CFT CAN HAVE DECIMAL VALUES
            // ==================================================

            const totalCFT =
                Number(
                    bill.totalCFT
                ) || 0;


            // ==================================================
            // WOOD TOTAL
            // ==================================================

            const woodTotal =
                Math.round(
                    Number(
                        bill.woodTotal
                    ) || 0
                );


            // ==================================================
            // LABOUR CHARGE
            // ==================================================

            const labourCharge =
                Math.round(
                    Number(
                        bill.labourCharge
                    ) || 0
                );


            // ==================================================
            // MAIN OTHER CHARGE
            // ==================================================

            const otherCharge =
                Math.round(
                    Number(
                        bill.otherCharge
                    ) || 0
                );


            // ==================================================
            // ALL OTHER CHARGES TOTAL
            // ==================================================

            const othersTotal =
                Math.round(
                    Number(
                        bill.othersTotal
                    ) || 0
                );


            // ==================================================
            // DISCOUNT
            // ==================================================

            const discountAmount =
                Math.round(
                    Number(
                        bill.discountAmount
                    ) || 0
                );


            // ==================================================
            // GRAND TOTAL
            // ==================================================

            const grandTotal =
                Math.round(
                    Number(
                        bill.grandTotal
                    ) || 0
                );


            // ==================================================
            // RETURN AMOUNT
            //
            // NEW BILL = 0 RETURN
            // ==================================================

            const returnAmount = 0;


            // ==================================================
            // STATUS
            //
            // BALANCE > 0
            //     PENDING
            //
            // BALANCE = 0
            //     DELIVERED
            // ==================================================

            let status = "DELIVERED";

            if (balanceAmount > 0) {

                status = "PENDING";

            }


            // ==================================================
            // WOOD JSON DATA
            // ==================================================

            const woodData =
                JSON.stringify(
                    bill.woodData || []
                );


            // ==================================================
            // OTHER CHARGES JSON DATA
            // ==================================================

            const othersData =
                JSON.stringify(
                    bill.othersData || []
                );


            // ==================================================
            // REMARK
            // ==================================================

            const remark =
                bill.remark || "";


            // ==================================================
            // DEBUG
            // ==================================================

            console.log(
                "--------------------------------------"
            );

            console.log(
                "CUSTOMER NAME:",
                customerName
            );

            console.log(
                "CUSTOMER MOBILE:",
                customerMobile
            );

            console.log(
                "CUSTOMER PLACE:",
                customerPlace
            );

            console.log(
                "PAYMENT TYPE:",
                paymentType
            );

            console.log(
                "PAYMENT MODE:",
                paymentMode
            );

            console.log(
                "TOTAL CFT:",
                totalCFT
            );

            console.log(
                "WOOD TOTAL:",
                woodTotal
            );

            console.log(
                "LABOUR CHARGE:",
                labourCharge
            );

            console.log(
                "OTHER CHARGE:",
                otherCharge
            );

            console.log(
                "OTHERS TOTAL:",
                othersTotal
            );

            console.log(
                "DISCOUNT:",
                discountAmount
            );

            console.log(
                "GRAND TOTAL:",
                grandTotal
            );

            console.log(
                "ADVANCE:",
                advanceAmount
            );

            console.log(
                "BALANCE:",
                balanceAmount
            );

            console.log(
                "STATUS:",
                status
            );

            console.log(
                "--------------------------------------"
            );


            // ==================================================
            // INSERT BILL
            //
            // 25-COLUMN TABLE
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
                    payment_mode,

                    advance_amount,
                    balance_amount,

                    total_cft,

                    wood_total,
                    labour_charge,
                    other_charge,
                    others_total,

                    discount_amount,
                    grand_total,

                    wood_data,
                    others_data,

                    remark,

                    return_amount,
                    status

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

                    ?,
                    ?,

                    ?,

                    ?,
                    ?

                )

            `;


            // ==================================================
            // VALUES
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
                paymentMode,

                advanceAmount,
                balanceAmount,

                totalCFT,

                woodTotal,
                labourCharge,
                otherCharge,
                othersTotal,

                discountAmount,
                grandTotal,

                woodData,
                othersData,

                remark,

                returnAmount,
                status

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
                        "Grand Total:",
                        grandTotal
                    );

                    console.log(
                        "Status:",
                        status
                    );

                    console.log(
                        "======================================"
                    );


                    // ==================================================
                    // RESPONSE
                    // ==================================================

                    return res.json({

                        success: true,

                        message:
                            "Bill Saved Successfully",

                        billId:
                            result.insertId,

                        billNo:
                            billNo,

                        customerId:
                            customerId,

                        status:
                            status,

                        grandTotal:
                            grandTotal

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
                    "GET ALL BILLS ERROR:",
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
            payment_type,
            payment_mode,
            advance_amount,
            balance_amount,
            discount_amount,
            grand_total,
            return_amount,
            status,
            remark

        FROM bills

        WHERE status = 'PENDING'
           OR balance_amount > 0

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
        paidAmount,
        paymentMode
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
        Math.round(
            Number(paidAmount)
        );


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
    // GET CURRENT BILL
    // ==================================================

    connection.query(

        `

            SELECT
                advance_amount,
                balance_amount,
                payment_mode,
                status

            FROM bills

            WHERE id = ?

        `,

        [id],

        (err, results) => {

            if (err) {

                console.error(
                    "SELECT PENDING BILL ERROR:",
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
            // DON'T PAY MORE THAN BALANCE
            // ==================================================

            const actualPayment =
                Math.min(
                    payment,
                    balance
                );


            // ==================================================
            // NEW VALUES
            // ==================================================

            const newAdvance =
                Math.round(
                    advance +
                    actualPayment
                );


            const newBalance =
                Math.max(
                    0,
                    Math.round(
                        balance -
                        actualPayment
                    )
                );


            // ==================================================
            // STATUS
            // ==================================================

            const newStatus =
                newBalance <= 0
                    ? "DELIVERED"
                    : "PENDING";


            // ==================================================
            // PAYMENT MODE
            // ==================================================

            const newPaymentMode =
                String(
                    paymentMode ||
                    results[0].payment_mode ||
                    ""
                ).trim();


            // ==================================================
            // UPDATE
            // ==================================================

            connection.query(

                `

                    UPDATE bills

                    SET

                        advance_amount = ?,

                        balance_amount = ?,

                        payment_mode = ?,

                        status = ?

                    WHERE id = ?

                `,

                [

                    newAdvance,

                    newBalance,

                    newPaymentMode,

                    newStatus,

                    id

                ],

                (updateError) => {

                    if (updateError) {

                        console.error(
                            "UPDATE PENDING BILL ERROR:",
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
                            newBalance,

                        paymentMode:
                            newPaymentMode,

                        status:
                            newStatus

                    });

                }

            );

        }

    );

});


// ======================================================
// RETURN BILL
// ======================================================
//
// User sends:
//
// {
//     id: 10,
//     returnAmount: 500
// }
//
// The return amount is added to the existing return amount.
//
// Grand total is reduced by the return amount.
//
// Status becomes RETURN.
// ======================================================

app.put("/return-bill", (req, res) => {

    const {
        id,
        returnAmount
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        !id ||
        returnAmount === undefined
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID and return amount are required"

        });

    }


    const amount =
        Math.round(
            Number(returnAmount)
        );


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Return amount must be greater than 0"

        });

    }


    // ==================================================
    // GET BILL
    // ==================================================

    connection.query(

        `

            SELECT

                grand_total,
                return_amount,
                status

            FROM bills

            WHERE id = ?

        `,

        [id],

        (err, results) => {

            if (err) {

                console.error(
                    "GET RETURN BILL ERROR:",
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

            const oldGrandTotal =
                Math.round(
                    Number(
                        results[0].grand_total
                    ) || 0
                );


            const oldReturnAmount =
                Math.round(
                    Number(
                        results[0].return_amount
                    ) || 0
                );


            // ==================================================
            // DON'T RETURN MORE THAN GRAND TOTAL
            // ==================================================

            const availableAmount =
                Math.max(
                    0,
                    oldGrandTotal
                );


            const actualReturn =
                Math.min(
                    amount,
                    availableAmount
                );


            // ==================================================
            // NEW RETURN TOTAL
            // ==================================================

            const newReturnAmount =
                Math.round(
                    oldReturnAmount +
                    actualReturn
                );


            // ==================================================
            // NEW GRAND TOTAL
            // ==================================================

            const newGrandTotal =
                Math.max(
                    0,
                    Math.round(
                        oldGrandTotal -
                        actualReturn
                    )
                );


            // ==================================================
            // STATUS
            // ==================================================

            const newStatus =
                "RETURN";


            // ==================================================
            // UPDATE
            // ==================================================

            connection.query(

                `

                    UPDATE bills

                    SET

                        grand_total = ?,

                        return_amount = ?,

                        status = ?

                    WHERE id = ?

                `,

                [

                    newGrandTotal,

                    newReturnAmount,

                    newStatus,

                    id

                ],

                (updateError) => {

                    if (updateError) {

                        console.error(
                            "RETURN BILL UPDATE ERROR:",
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
                            "Bill Returned Successfully",

                        returnAmount:
                            newReturnAmount,

                        grandTotal:
                            newGrandTotal,

                        status:
                            newStatus

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
