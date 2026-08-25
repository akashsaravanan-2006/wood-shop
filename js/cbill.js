// ============================================================
// CBILL.JS
// FINAL SAVED BILL
// SAME DATA LOGIC AS BILL.JS
//
// IMPORTANT:
// Bill number is NEVER generated here.
// Database-generated bill_no is displayed.
// ============================================================

console.clear();

console.log("==========================================");
console.log("              CBILL.JS LOADED");
console.log("==========================================");


// ============================================================
// API
// ============================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ============================================================
// ELEMENTS
// ============================================================

const billNoElement =
    document.getElementById("billNo");

const billDateElement =
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");

const woodTable =
    document.getElementById("woodTable");

const chargeTable =
    document.getElementById("chargeTable");

const woodTotalElement =
    document.getElementById("woodTotal");

const othersTotalElement =
    document.getElementById("othersTotal");

const subtotalAmountElement =
    document.getElementById("subtotalAmount");

const subtotalElement =
    document.getElementById("subtotal");

const discountRow =
    document.getElementById("discountRow");

const discountAmountElement =
    document.getElementById("discountAmount");

const grandTotalElement =
    document.getElementById("grandTotal");

const advanceRow =
    document.getElementById("advanceRow");

const advanceAmountElement =
    document.getElementById("advanceAmount");

const balanceAmountElement =
    document.getElementById("balanceAmount");

const cftSummary =
    document.getElementById("cftSummary");

const printBtn =
    document.getElementById("printBtn");

const homeBtn =
    document.getElementById("homeBtn");

const clearBtn =
    document.getElementById("clearBtn");


// ============================================================
// SAVED BILL ID
// ============================================================

const savedBillId =
    localStorage.getItem(
        "savedBillId"
    );


console.log(
    "SAVED BILL ID:",
    savedBillId
);


// ============================================================
// NUMBER HELPER
// ============================================================

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const number =
        parseFloat(
            String(value)
                .replace(/[₹,\s]/g, "")
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return (
        "₹ " +
        numberValue(value).toFixed(2)
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// SAFE JSON
// ============================================================

function parseJSON(
    value,
    fallback
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return fallback;

    }


    if (
        typeof value !== "string"
    ) {

        return value;

    }


    try {

        return JSON.parse(
            value
        );

    }
    catch (error) {

        console.error(
            "JSON ERROR:",
            error
        );

        return fallback;

    }

}


// ============================================================
// LOCAL BILL DATA
// SAME SOURCE USED BY BILL.JS
// ============================================================

function getLocalBillData() {

    let data = {};


    // --------------------------------------------------------
    // current_bill_data
    // --------------------------------------------------------

    try {

        data =
            JSON.parse(
                localStorage.getItem(
                    "current_bill_data"
                ) || "{}"
            );

    }
    catch (error) {

        console.error(
            "current_bill_data ERROR:",
            error
        );

        data = {};

    }


    return data || {};

}


// ============================================================
// LOCAL DATA
// ============================================================

const localBillData =
    getLocalBillData();


console.log(
    "LOCAL BILL DATA:",
    localBillData
);


// ============================================================
// LOCAL PERSONAL DATA
// ============================================================

const localPersonal =
    localBillData.personal ||
    {};


// ============================================================
// GET CUSTOMER FROM LOCAL STORAGE
// ============================================================

function getLocalCustomer() {

    let name =
        localPersonal.name ||
        localPersonal.customerName ||
        localStorage.getItem(
            "customerName"
        ) ||
        "";


    let mobile =
        localPersonal.mobile ||
        localPersonal.customerMobile ||
        localStorage.getItem(
            "customerMobile"
        ) ||
        "";


    let place =
        localPersonal.place ||
        localPersonal.customerPlace ||
        localStorage.getItem(
            "customerPlace"
        ) ||
        "";


    return {

        name:
            name,

        mobile:
            mobile,

        place:
            place

    };

}


// ============================================================
// GET DISCOUNT
// ============================================================

function getDiscount(
    bill
) {

    let discount = 0;


    // DATABASE
    if (
        bill.discount_amount !==
            undefined &&
        bill.discount_amount !==
            null &&
        bill.discount_amount !== ""
    ) {

        discount =
            numberValue(
                bill.discount_amount
            );

    }

    // DATABASE SECOND FIELD
    else if (
        bill.discount !==
            undefined &&
        bill.discount !==
            null &&
        bill.discount !== ""
    ) {

        discount =
            numberValue(
                bill.discount
            );

    }

    // LOCAL STORAGE
    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );

    }


    if (
        discount === 0
    ) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discount"
                )
            );

    }


    if (
        discount < 0
    ) {

        discount = 0;

    }


    return discount;

}


// ============================================================
// GET ADVANCE
// ============================================================

function getAdvanceAmount(
    bill
) {

    let advance = null;


    // DATABASE
    if (
        bill.advance_amount !==
            undefined &&
        bill.advance_amount !==
            null &&
        bill.advance_amount !== ""
    ) {

        advance =
            numberValue(
                bill.advance_amount
            );

    }

    // DATABASE SECOND FIELD
    else if (
        bill.advance !==
            undefined &&
        bill.advance !==
            null &&
        bill.advance !== ""
    ) {

        advance =
            numberValue(
                bill.advance
            );

    }


    // LOCAL STORAGE FALLBACK
    if (
        advance === null ||
        !Number.isFinite(
            advance
        )
    ) {

        advance =
            numberValue(
                localStorage.getItem(
                    "advanceAmount"
                )
            );

    }


    if (
        advance < 0
    ) {

        advance = 0;

    }


    return advance;

}


// ============================================================
// DATE
// ============================================================

function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return (

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

        + "/" +

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        + "/" +

        date.getFullYear()

    );

}


// ============================================================
// TIME
// ============================================================

function formatTime(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                true
        }
    );

}


// ============================================================
// LOAD BILL
// ============================================================

async function loadFinalBill() {

    console.log(
        "=========================================="
    );

    console.log(
        "STARTING CBILL"
    );

    console.log(
        "=========================================="
    );


    if (
        !savedBillId
    ) {

        console.error(
            "savedBillId is missing"
        );


        if (
            billNoElement
        ) {

            billNoElement.textContent =
                "---";

        }


        alert(
            "Saved bill ID is missing."
        );


        return;

    }


    try {

        // ====================================================
        // FETCH DATABASE BILL
        // ====================================================

        const response =
            await fetch(
                `${API_URL}/bill/${savedBillId}`
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // ====================================================
        // DATABASE RESPONSE
        // ====================================================

        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        const bill =
            result.bill ||
            result.data ||
            result;


        if (
            !bill
        ) {

            throw new Error(
                "Bill not found."
            );

        }


        console.log(
            "FINAL BILL OBJECT:",
            bill
        );


        // ====================================================
        // BILL NUMBER
        // ====================================================
        //
        // DO NOT GENERATE.
        //
        // Database-generated number only.
        //
        // ====================================================

        if (
            billNoElement
        ) {

            billNoElement.textContent =
                bill.bill_no ||
                "---";

        }


        if (
            bill.bill_no
        ) {

            localStorage.setItem(
                "savedBillNo",
                bill.bill_no
            );

        }


        // ====================================================
        // CUSTOMER
        // ====================================================
        //
        // FIRST DATABASE
        // THEN LOCAL BILL.JS DATA
        //
        // ====================================================

        const localCustomer =
            getLocalCustomer();


        const customerName =
            bill.customer_name ||
            bill.customerName ||
            localCustomer.name ||
            "-";


        const customerMobile =
            bill.customer_mobile ||
            bill.customerMobile ||
            localCustomer.mobile ||
            "-";


        const customerPlace =
            bill.customer_place ||
            bill.customerPlace ||
            localCustomer.place ||
            "-";


        console.log(
            "CUSTOMER FINAL:",
            customerName
        );

        console.log(
            "MOBILE FINAL:",
            customerMobile
        );

        console.log(
            "PLACE FINAL:",
            customerPlace
        );


        if (
            customerNameElement
        ) {

            customerNameElement.textContent =
                customerName;

        }


        if (
            customerMobileElement
        ) {

            customerMobileElement.textContent =
                customerMobile;

        }


        if (
            customerPlaceElement
        ) {

            customerPlaceElement.textContent =
                customerPlace;

        }


        // ====================================================
        // DATE
        // ====================================================

        const billDate =
            bill.bill_date ||
            bill.date ||
            bill.created_at;


        if (
            billDateElement
        ) {

            billDateElement.textContent =
                formatDate(
                    billDate
                );

        }


        // ====================================================
        // TIME
        // ====================================================

        const billTime =
            bill.bill_time ||
            bill.time ||
            bill.created_at;


        if (
            billDayTimeElement
        ) {

            billDayTimeElement.textContent =
                formatTime(
                    billTime
                );

        }


        // ====================================================
        // WOOD TOTAL
        // ====================================================

        const woodTotal =
            numberValue(
                bill.wood_total
            );


        // ====================================================
        // OTHER TOTAL
        // ====================================================

        const othersTotal =
            numberValue(
                bill.others_total
            );


        // ====================================================
        // SUBTOTAL
        // ====================================================

        const subtotal =
            woodTotal +
            othersTotal;


        // ====================================================
        // DISCOUNT
        // ====================================================

        const discount =
            getDiscount(
                bill
            );


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        let grandTotal =
            subtotal -
            discount;


        if (
            grandTotal < 0
        ) {

            grandTotal = 0;

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        let advanceAmount =
            getAdvanceAmount(
                bill
            );


        if (
            advanceAmount > grandTotal
        ) {

            advanceAmount =
                grandTotal;

        }


        // ====================================================
        // BALANCE
        // ====================================================

        let balanceAmount =
            grandTotal -
            advanceAmount;


        if (
            balanceAmount < 0
        ) {

            balanceAmount = 0;

        }


        // ====================================================
        // DISPLAY TOTALS
        // ====================================================

        if (
            woodTotalElement
        ) {

            woodTotalElement.textContent =
                money(
                    woodTotal
                );

        }


        if (
            othersTotalElement
        ) {

            othersTotalElement.textContent =
                money(
                    othersTotal
                );

        }


        if (
            subtotalAmountElement
        ) {

            subtotalAmountElement.textContent =
                money(
                    subtotal
                );

        }


        if (
            subtotalElement
        ) {

            subtotalElement.textContent =
                money(
                    subtotal
                );

        }


        // ====================================================
        // DISCOUNT
        // ====================================================

        if (
            discount > 0
        ) {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "flex";

            }


            if (
                discountAmountElement
            ) {

                discountAmountElement.textContent =
                    "- " +
                    money(
                        discount
                    );

            }

        }
        else {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "none";

            }

        }


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        if (
            grandTotalElement
        ) {

            grandTotalElement.textContent =
                money(
                    grandTotal
                );

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        if (
            advanceAmountElement
        ) {

            advanceAmountElement.textContent =
                money(
                    advanceAmount
                );

        }


        if (
            advanceRow
        ) {

            advanceRow.style.display =
                advanceAmount > 0
                    ? "flex"
                    : "none";

        }


        // ====================================================
        // BALANCE
        // ====================================================

        if (
            balanceAmountElement
        ) {

            balanceAmountElement.textContent =
                money(
                    balanceAmount
                );

        }


        // ====================================================
        // WOOD DATA
        // ====================================================

        let woodData =
            bill.wood_data;


        if (
            typeof woodData ===
            "string"
        ) {

            woodData =
                parseJSON(
                    woodData,
                    []
                );

        }


        if (
            !Array.isArray(
                woodData
            )
        ) {

            woodData = [];

        }


        // ====================================================
        // FALLBACK TO LOCAL BILL DATA
        // SAME AS BILL.JS
        // ====================================================

        if (
            woodData.length === 0
        ) {

            const localWood =
                localBillData.wood ||
                {};


            if (
                Array.isArray(
                    localWood.calculations
                )
            ) {

                woodData =
                    localWood.calculations;

            }

        }


        console.log(
            "WOOD DATA:",
            woodData
        );


        console.log(
            "WOOD COUNT:",
            woodData.length
        );


        console.table(
            woodData
        );


        // ====================================================
        // DISPLAY WOOD
        // ====================================================

        loadWoodData(
            woodData
        );


        // ====================================================
        // OTHER CHARGES
        // ====================================================

        let othersData =
            bill.others_data;


        if (
            typeof othersData ===
            "string"
        ) {

            othersData =
                parseJSON(
                    othersData,
                    []
                );

        }


        if (
            !Array.isArray(
                othersData
            )
        ) {

            othersData = [];

        }


        // ====================================================
        // FALLBACK TO LOCAL BILL.JS DATA
        // ====================================================

        if (
            othersData.length === 0
        ) {

            const localLabour =
                localBillData.labour ||
                {};


            const localOthers =
                localBillData.others ||
                localBillData.otherCharges ||
                [];


            // ------------------------------------------------
            // CREATE CHARGES FROM BILL.JS DATA
            // ------------------------------------------------

            if (
                Array.isArray(
                    localOthers
                )
            ) {

                othersData =
                    localOthers;

            }


            // ------------------------------------------------
            // IF LABOUR DATA EXISTS
            // ------------------------------------------------

            if (
                Array.isArray(
                    localLabour.charges
                )
            ) {

                othersData =
                    localLabour.charges;

            }

        }


        console.log(
            "OTHER CHARGES DATA:",
            othersData
        );


        console.table(
            othersData
        );


        // ====================================================
        // DISPLAY OTHER CHARGES
        // ====================================================

        loadOtherCharges(
            bill,
            othersData
        );


        // ====================================================
        // CFT
        // ====================================================

        loadCftSummary(
            woodData
        );


        // ====================================================
        // SAVE TOTALS
        // ====================================================

        localStorage.setItem(
            "grandTotal",
            String(
                grandTotal
            )
        );


        localStorage.setItem(
            "finalTotal",
            String(
                grandTotal
            )
        );


        localStorage.setItem(
            "balanceAmount",
            String(
                balanceAmount
            )
        );


        // ====================================================
        // DEBUG SUMMARY
        // ====================================================

        console.log(
            "=========================================="
        );

        console.log(
            "FINAL CBILL SUMMARY"
        );

        console.log(
            "Bill No:",
            bill.bill_no
        );

        console.log(
            "Customer:",
            customerName
        );

        console.log(
            "Mobile:",
            customerMobile
        );

        console.log(
            "Place:",
            customerPlace
        );

        console.log(
            "Wood Total:",
            woodTotal
        );

        console.log(
            "Others Total:",
            othersTotal
        );

        console.log(
            "Subtotal:",
            subtotal
        );

        console.log(
            "Discount:",
            discount
        );

        console.log(
            "Grand Total:",
            grandTotal
        );

        console.log(
            "Advance:",
            advanceAmount
        );

        console.log(
            "Balance:",
            balanceAmount
        );

        console.log(
            "Wood Calculations:",
            woodData.length
        );

        console.log(
            "Other Charges:",
            othersData.length
        );

        console.log(
            "=========================================="
        );

    }

    catch (error) {

        console.error(
            "=========================================="
        );

        console.error(
            "CBILL ERROR:",
            error
        );

        console.error(
            "=========================================="
        );


        alert(
            "Unable to load final bill."
        );

    }

}


// ============================================================
// LOAD WOOD DATA
// ============================================================
//
// ONE CALCULATION = ONE ROW
//
// Length example:
//
// 9 → 4
// 5 → 6
//
// ============================================================

function loadWoodData(
    woodData
) {

    if (
        !woodTable
    ) {

        console.error(
            "woodTable not found."
        );

        return;

    }


    woodTable.innerHTML =
        "";


    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    No wood data
                </td>

            </tr>

        `;

        return;

    }


    let sno = 1;


    woodData.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

                return;

            }


            // =================================================
            // WOOD NAME
            // =================================================

            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "";


            if (
                woodName ===
                "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            if (
                !woodName
            ) {

                woodName =
                    "-";

            }


            // =================================================
            // SIZE
            // =================================================

            const breadth =
                numberValue(
                    item.breadth
                );


            const thickness =
                numberValue(
                    item.thickness
                );


            let size =
                "-";


            if (
                breadth > 0 &&
                thickness > 0
            ) {

                size =
                    `${breadth} × ${thickness}`;

            }
            else if (
                breadth > 0
            ) {

                size =
                    String(
                        breadth
                    );

            }
            else if (
                thickness > 0
            ) {

                size =
                    String(
                        thickness
                    );

            }


            // =================================================
            // QUALITY
            // =================================================

            const quality =
                item.quality !==
                    undefined &&
                item.quality !== ""
                    ? item.quality
                    : "-";


            // =================================================
            // PIECES
            // =================================================

            const pieces =
                Array.isArray(
                    item.pieces
                )
                    ? item.pieces
                    : [];


            // =================================================
            // LENGTH VALUES
            // =================================================

            let lengthValues =
                [];


            pieces.forEach(
                function (
                    piece
                ) {

                    if (
                        !piece
                    ) {

                        return;

                    }


                    const length =
                        numberValue(
                            piece.length
                        );


                    const extraLength =
                        numberValue(
                            piece.extraLength
                        );


                    const finalLength =
                        length +
                        extraLength;


                    const qty =
                        numberValue(
                            piece.qty
                        );


                    if (
                        finalLength > 0
                    ) {

                        lengthValues.push({

                            length:
                                finalLength,

                            qty:
                                qty

                        });

                    }

                }
            );


            // =================================================
            // DIRECT LENGTH FALLBACK
            // =================================================

            if (
                lengthValues.length === 0 &&
                item.length !==
                    undefined
            ) {

                const directLength =
                    numberValue(
                        item.length
                    );


                const directQty =
                    numberValue(
                        item.qty
                    );


                if (
                    directLength > 0
                ) {

                    lengthValues.push({

                        length:
                            directLength,

                        qty:
                            directQty

                    });

                }

            }


            // =================================================
            // LENGTH DISPLAY
            // =================================================

            let lengthText =
                "-";


            if (
                lengthValues.length > 0
            ) {

                lengthText =
                    lengthValues
                        .map(
                            function (
                                value
                            ) {

                                return (
                                    `${value.length} → ${value.qty}`
                                );

                            }
                        )
                        .join(
                            "<br>"
                        );

            }


            // =================================================
            // TOTAL QTY
            // =================================================

            let totalQty =
                0;


            pieces.forEach(
                function (
                    piece
                ) {

                    if (
                        !piece
                    ) {

                        return;

                    }


                    totalQty +=
                        numberValue(
                            piece.qty
                        );

                }
            );


            if (
                totalQty === 0 &&
                item.qty !==
                    undefined
            ) {

                totalQty =
                    numberValue(
                        item.qty
                    );

            }

            // =================================================
            // CFT
            // =================================================

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            // =================================================
            // RATE
            // =================================================

            const rate =
                numberValue(
                    item.rate
                );


            // =================================================
            // AMOUNT
            // =================================================

            const amount =
                numberValue(
                    item.amount
                );


            // =================================================
            // CREATE ROW
            // =================================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${sno}
                </td>

                <td>
                    ${escapeHTML(
                        woodName
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        size
                    )}
                </td>

                <td>
                    ${lengthText}
                </td>

                <td>
                    ${totalQty}
                </td>

                <td>
                    ${cubicFeet.toFixed(2)}
                </td>

                <td>
                    ${money(
                        rate
                    )}
                </td>

                <td>
                    ${money(
                        amount
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        quality
                    )}
                </td>

            `;


            woodTable.appendChild(
                row
            );


            console.log(
                "WOOD CALCULATION:",
                sno,
                {
                    wood:
                        woodName,

                    size:
                        size,

                    lengths:
                        lengthValues,

                    qty:
                        totalQty,

                    cft:
                        cubicFeet,

                    rate:
                        rate,

                    amount:
                        amount,

                    quality:
                        quality
                }
            );


            sno++;

        }
    );

}


// ============================================================
// LOAD OTHER CHARGES
// ============================================================
//
// IMPORTANT:
//
// Database charges are used first.
// If database does not contain charge details,
// bill.js local data is used.
//
// ============================================================

function loadOtherCharges(
    bill,
    othersData
) {

    if (
        !chargeTable
    ) {

        console.error(
            "chargeTable not found."
        );

        return;

    }


    chargeTable.innerHTML =
        "";


    let sno = 1;

    let hasCharge =
        false;


    // =================================================
    // LABOUR CHARGE
    // =================================================

    const labour =
        numberValue(
            bill.labour_charge
        );


    if (
        labour > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>

            <td>
                Labour Charge
            </td>

            <td>
                ${money(
                    labour
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // =================================================
    // OTHER CHARGE
    // =================================================

    const otherCharge =
        numberValue(
            bill.other_charge
        );


    if (
        otherCharge > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>

            <td>
                Other Charge
            </td>

            <td>
                ${money(
                    otherCharge
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // =================================================
    // ADDITIONAL CHARGES
    // =================================================

    if (
        Array.isArray(
            othersData
        )
    ) {

        othersData.forEach(
            function (
                item
            ) {

                if (
                    !item
                ) {

                    return;

                }


                const amount =
                    numberValue(
                        item.amount ||
                        item.charge ||
                        item.value
                    );


                if (
                    amount <= 0
                ) {

                    return;

                }


                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";


                hasCharge =
                    true;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${sno++}
                    </td>

                    <td>
                        ${escapeHTML(
                            name
                        )}
                    </td>

                    <td>
                        ${money(
                            amount
                        )}
                    </td>

                `;


                chargeTable.appendChild(
                    row
                );

            }
        );

    }


    // =================================================
    // IF NO CHARGE
    // =================================================

    if (
        !hasCharge
    ) {

        chargeTable.innerHTML = `

            <tr>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

            </tr>

        `;

    }


    console.log(
        "OTHER CHARGES DISPLAYED:",
        hasCharge
    );

}


// ============================================================
// CFT SUMMARY
// ============================================================
//
// SAME WOOD + SAME QUALITY ARE COMBINED
//
// ============================================================

function loadCftSummary(
    woodData
) {

    if (
        !cftSummary
    ) {

        return;

    }


    cftSummary.innerHTML =
        "";


    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        cftSummary.innerHTML =
            "<p>-</p>";

        return;

    }


    // ========================================================
    // GROUP SAME WOOD + SAME QUALITY
    // ========================================================
    //
    // Example:
    //
    // Teak quality 2 = 3.65 CFT
    // Teak quality 2 = 8.00 CFT
    //
    // Result:
    // Teak (2) = 11.65 CFT
    //
    // ========================================================

    const grouped =
        new Map();


    woodData.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

                return;

            }


            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "-";


            if (
                woodName ===
                "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            const quality =
                item.quality !==
                    undefined &&
                item.quality !== ""
                    ? String(item.quality)
                    : "-";


            const cft =
                numberValue(
                    item.cubicFeet
                );


            const key =
                `${String(woodName).trim().toLowerCase()}||${quality.trim().toLowerCase()}`;


            if (
                !grouped.has(
                    key
                )
            ) {

                grouped.set(
                    key,
                    {
                        wood:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0
                    }
                );

            }


            grouped.get(
                key
            ).cft += cft;

        }
    );


    // ========================================================
    // DISPLAY GROUPED CFT
    // ========================================================

    let index = 1;


    grouped.forEach(
        function (
            group
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cft-summary-row";


            row.style.display =
                "flex";

            row.style.justifyContent =
                "space-between";

            row.style.alignItems =
                "center";

            row.style.width =
                "100%";

            row.style.lineHeight =
                "1.5";


            row.innerHTML = `

                <span
                    class="cft-summary-name"
                    style="text-align:left; flex:1;"
                >

                    <b>
                        ${index}.
                        ${escapeHTML(
                            group.wood
                        )}
                        (${escapeHTML(
                            group.quality
                        )})
                    </b>

                </span>

                <span
                    class="cft-summary-value"
                    style="text-align:right; min-width:100px;"
                >

                    ${group.cft.toFixed(2)} CFT

                </span>

            `;


            cftSummary.appendChild(
                row
            );


            index++;

        }
    );

}

// ============================================================
// PRINT
// ============================================================

if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function () {

            console.log(
                "PRINT BILL"
            );


            window.print();

        }
    );

}


// ============================================================
// HOME
// ============================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// CLEAR
// ============================================================

if (
    clearBtn
) {

    clearBtn.addEventListener(
        "click",
        function () {

            const ok =
                confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (
                !ok
            ) {

                return;

            }


            // ------------------------------------------------
            // BILL DATA
            // ------------------------------------------------

            localStorage.removeItem(
                "current_bill_data"
            );


            // ------------------------------------------------
            // SAVED BILL
            // ------------------------------------------------

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            // ------------------------------------------------
            // WOOD
            // ------------------------------------------------

            localStorage.removeItem(
                "woodData"
            );

            localStorage.removeItem(
                "wood_page_data"
            );

            localStorage.removeItem(
                "wood"
            );

            localStorage.removeItem(
                "woodDataStorage"
            );


            // ------------------------------------------------
            // CUSTOMER
            // ------------------------------------------------

            localStorage.removeItem(
                "customerName"
            );

            localStorage.removeItem(
                "customerMobile"
            );

            localStorage.removeItem(
                "customerPlace"
            );


            // ------------------------------------------------
            // LABOUR / OTHER
            // ------------------------------------------------

            localStorage.removeItem(
                "labour"
            );

            localStorage.removeItem(
                "labourData"
            );

            localStorage.removeItem(
                "labourCharge"
            );

            localStorage.removeItem(
                "otherCharge"
            );

            localStorage.removeItem(
                "othersData"
            );


            // ------------------------------------------------
            // DISCOUNT
            // ------------------------------------------------

            localStorage.removeItem(
                "discount"
            );

            localStorage.removeItem(
                "discountAmount"
            );

            localStorage.removeItem(
                "discountApplied"
            );


            // ------------------------------------------------
            // ADVANCE
            // ------------------------------------------------

            localStorage.removeItem(
                "advance"
            );

            localStorage.removeItem(
                "advanceAmount"
            );

            localStorage.removeItem(
                "balanceAmount"
            );


            // ------------------------------------------------
            // TOTALS
            // ------------------------------------------------

            localStorage.removeItem(
                "grandTotal"
            );

            localStorage.removeItem(
                "finalTotal"
            );

            localStorage.removeItem(
                "subtotal"
            );

            localStorage.removeItem(
                "woodTotal"
            );

            localStorage.removeItem(
                "othersTotal"
            );


            // ------------------------------------------------
            // BILL STATUS
            // ------------------------------------------------

            localStorage.removeItem(
                "billConfirmed"
            );

            localStorage.removeItem(
                "billConfirmedAt"
            );

            localStorage.removeItem(
                "editingBill"
            );


            sessionStorage.clear();


            console.log(
                "ALL BILL DATA CLEARED"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// WHATSAPP + PDF
// ============================================================
//
// Click WhatsApp:
//
// 1. Get customer details
// 2. Generate complete bill PDF
// 3. Create greeting message
// 4. Share PDF through device share
// 5. WhatsApp can be selected from share sheet
//
// ============================================================

const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


if (
    whatsappBtn
) {

    whatsappBtn.addEventListener(
        "click",
        async function () {

            console.log(
                "===================================="
            );

            console.log(
                "WHATSAPP BILL BUTTON CLICKED"
            );

            console.log(
                "===================================="
            );


            // ==================================================
            // CUSTOMER NAME
            // ==================================================

            const customerNameForWhatsApp =
                personalData.name ||
                personalData.customerName ||
                customerName ||
                "";


            // ==================================================
            // CUSTOMER MOBILE
            // ==================================================

            let customerMobileForWhatsApp =
                personalData.mobile ||
                personalData.customerMobile ||
                customerMobile ||
                "";


            // Remove spaces, +91, -, brackets etc.
            customerMobileForWhatsApp =
                String(
                    customerMobileForWhatsApp
                )
                .replace(
                    /\D/g,
                    ""
                );


            console.log(
                "CUSTOMER NAME:",
                customerNameForWhatsApp
            );

            console.log(
                "CUSTOMER MOBILE:",
                customerMobileForWhatsApp
            );


            // ==================================================
            // VALIDATE CUSTOMER NAME
            // ==================================================

            if (
                !customerNameForWhatsApp
            ) {

                alert(
                    "Customer name is missing.\n\n" +
                    "Please enter the customer name in Personal Details."
                );

                return;

            }


            // ==================================================
            // VALIDATE MOBILE
            // ==================================================

            if (
                customerMobileForWhatsApp.length === 12 &&
                customerMobileForWhatsApp.startsWith("91")
            ) {

                customerMobileForWhatsApp =
                    customerMobileForWhatsApp.substring(
                        2
                    );

            }


            if (
                customerMobileForWhatsApp.length !== 10
            ) {

                alert(
                    "Customer mobile number is not valid.\n\n" +
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            // ==================================================
            // CREATE DISPLAY NAME
            //
            // Example:
            //
            // Akash Saravanan
            //
            // becomes:
            //
            // Mr. Akash Saravanan
            // ==================================================

            const greetingName =
                customerNameForWhatsApp
                    .trim();


            // ==================================================
            // PROFESSIONAL MESSAGE
            // ==================================================

            const whatsappMessage =

`Dear Mr. ${greetingName},

Please find your bill attached.

Thank you for shopping with us.
We look forward to serving you again.

— Amman Saw Mill`;


            console.log(
                "WHATSAPP MESSAGE:"
            );

            console.log(
                whatsappMessage
            );


            // ==================================================
            // CONFIRM
            // ==================================================

            const sendConfirmation =
                confirm(
                    "Generate the bill PDF and send it to " +
                    customerNameForWhatsApp +
                    " on WhatsApp?"
                );


            if (
                !sendConfirmation
            ) {

                console.log(
                    "WHATSAPP SEND CANCELLED"
                );

                return;

            }


            // ==================================================
            // CHECK HTML2PDF
            // ==================================================

            if (
                typeof html2pdf ===
                "undefined"
            ) {

                alert(
                    "PDF generator is not loaded.\n\n" +
                    "Please check your internet connection and reload the page."
                );

                console.error(
                    "html2pdf.js NOT FOUND"
                );

                return;

            }


            // ==================================================
            // SHOW LOADING
            // ==================================================

            const oldButtonText =
                whatsappBtn.textContent;


            whatsappBtn.disabled =
                true;


            whatsappBtn.textContent =
                "Creating PDF...";


            try {

                // ==================================================
                // BILL CONTAINER
                // ==================================================

                const billElement =
                    document.querySelector(
                        ".bill-container"
                    );


                if (
                    !billElement
                ) {

                    throw new Error(
                        "Bill container not found."
                    );

                }


                // ==================================================
                // PDF FILE NAME
                // ==================================================

                const billNumber =
                    billData.billNo ||
                    billData.billNumber ||
                    document.getElementById(
                        "billNo"
                    )?.textContent?.trim() ||
                    "Bill";


                const safeCustomerName =
                    customerNameForWhatsApp
                        .replace(
                            /[^a-zA-Z0-9 ]/g,
                            ""
                        )
                        .trim()
                        .replace(
                            /\s+/g,
                            "_"
                        );


                const pdfFileName =
                    `${safeCustomerName}_${billNumber}.pdf`;


                // ==================================================
                // CLONE BILL
                //
                // We clone instead of modifying the actual bill.
                // ==================================================

                const billClone =
                    billElement.cloneNode(
                        true
                    );


                // ==================================================
                // HIDE BUTTONS IN PDF
                // ==================================================

                const clonedButtons =
                    billClone.querySelector(
                        ".buttons"
                    );


                if (
                    clonedButtons
                ) {

                    clonedButtons.remove();

                }


                // ==================================================
                // HIDE ANY OTHER NON-BILL ELEMENTS
                // ==================================================

                billClone
                    .querySelectorAll(
                        "button"
                    )
                    .forEach(
                        function (
                            button
                        ) {

                            button.remove();

                        }
                    );


                // ==================================================
                // PDF WRAPPER
                // ==================================================

                const pdfWrapper =
                    document.createElement(
                        "div"
                    );


                pdfWrapper.style.position =
                    "absolute";

                pdfWrapper.style.left =
                    "-100000px";

                pdfWrapper.style.top =
                    "0";

                pdfWrapper.style.width =
                    "794px";

                pdfWrapper.style.background =
                    "#ffffff";

                pdfWrapper.style.padding =
                    "20px";

                pdfWrapper.style.boxSizing =
                    "border-box";


                pdfWrapper.appendChild(
                    billClone
                );


                document.body.appendChild(
                    pdfWrapper
                );


                // ==================================================
                // PDF OPTIONS
                // ==================================================

                const pdfOptions = {

                    margin: 8,

                    filename:
                        pdfFileName,

                    image: {

                        type: "jpeg",

                        quality: 0.98

                    },

                    html2canvas: {

                        scale: 2,

                        useCORS: true,

                        backgroundColor:
                            "#ffffff"

                    },

                    jsPDF: {

                        unit: "mm",

                        format: "a4",

                        orientation:
                            "portrait"

                    },

                    pagebreak: {

                        mode: [
                            "css",
                            "legacy"
                        ]

                    }

                };


                // ==================================================
                // GENERATE PDF BLOB
                // ==================================================

                whatsappBtn.textContent =
                    "Generating PDF...";


                const pdfBlob =
                    await html2pdf()
                        .set(
                            pdfOptions
                        )
                        .from(
                            pdfWrapper
                        )
                        .outputPdf(
                            "blob"
                        );


                // ==================================================
                // REMOVE CLONE
                // ==================================================

                pdfWrapper.remove();


                // ==================================================
                // CREATE PDF FILE
                // ==================================================

                const pdfFile =
                    new File(
                        [
                            pdfBlob
                        ],
                        pdfFileName,
                        {
                            type:
                                "application/pdf"
                        }
                    );


                console.log(
                    "PDF CREATED:",
                    pdfFileName
                );

                console.log(
                    "PDF SIZE:",
                    pdfFile.size
                );


                // ==================================================
                // CHECK FILE SHARING SUPPORT
                // ==================================================

                const shareData = {

                    title:
                        `Bill - ${customerNameForWhatsApp}`,

                    text:
                        whatsappMessage,

                    files: [
                        pdfFile
                    ]

                };


                // ==================================================
                // NATIVE FILE SHARE
                // ==================================================

                if (
                    navigator.share &&
                    navigator.canShare &&
                    navigator.canShare(
                        {
                            files: [
                                pdfFile
                            ]
                        }
                    )
                ) {

                    whatsappBtn.textContent =
                        "Opening WhatsApp...";


                    await navigator.share(
                        shareData
                    );


                    console.log(
                        "PDF SHARED SUCCESSFULLY"
                    );

                }


                // ==================================================
                // FALLBACK
                //
                // Desktop browsers may not support file sharing.
                // In that case:
                //
                // 1. Download PDF
                // 2. Open WhatsApp chat
                // 3. Message is pre-filled
                // 4. User attaches downloaded PDF
                // ==================================================

                else {

                    console.log(
                        "FILE SHARING NOT SUPPORTED"
                    );


                    // ----------------------------------------------
                    // DOWNLOAD PDF
                    // ----------------------------------------------

                    const downloadURL =
                        URL.createObjectURL(
                            pdfBlob
                        );


                    const downloadLink =
                        document.createElement(
                            "a"
                        );


                    downloadLink.href =
                        downloadURL;


                    downloadLink.download =
                        pdfFileName;


                    document.body.appendChild(
                        downloadLink
                    );


                    downloadLink.click();


                    downloadLink.remove();


                    URL.revokeObjectURL(
                        downloadURL
                    );


                    // ----------------------------------------------
                    // OPEN WHATSAPP
                    // ----------------------------------------------

                    const whatsappNumber =
                        "91" +
                        customerMobileForWhatsApp;


                    const whatsappURL =
                        "https://wa.me/" +
                        whatsappNumber +
                        "?text=" +
                        encodeURIComponent(
                            whatsappMessage
                        );


                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                    alert(
                        "The bill PDF has been downloaded.\n\n" +
                        "WhatsApp has been opened for the customer.\n\n" +
                        "Please attach the downloaded PDF to the WhatsApp message."
                    );

                }

            }
            catch (error) {

                console.error(
                    "WHATSAPP PDF ERROR:",
                    error
                );


                // ==================================================
                // REMOVE CLONE IF ERROR OCCURRED
                // ==================================================

                const remainingWrapper =
                    document.querySelector(
                        'body > div[style*="-100000px"]'
                    );


                if (
                    remainingWrapper
                ) {

                    remainingWrapper.remove();

                }


                // ==================================================
                // USER CANCELLED SHARE
                // ==================================================

                if (
                    error &&
                    error.name ===
                    "AbortError"
                ) {

                    console.log(
                        "User cancelled sharing."
                    );

                }
                else {

                    alert(
                        "Unable to create or share the bill PDF.\n\n" +
                        "Please try again."
                    );

                }

            }
            finally {

                // ==================================================
                // RESTORE BUTTON
                // ==================================================

                whatsappBtn.disabled =
                    false;


                whatsappBtn.textContent =
                    oldButtonText ||
                    "WhatsApp";

            }

        }
    );

}
else {

    console.warn(
        "WhatsApp button not found."
    );
}




// ============================================================
// START
// ============================================================

console.log(
    "STARTING CBILL..."
);


