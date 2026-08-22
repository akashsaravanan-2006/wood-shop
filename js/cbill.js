// =====================================================
// CBILL.JS
// FINAL SAVED BILL - DEBUG VERSION
// =====================================================

console.clear();

console.log("====================================");
console.log("          CBILL.JS LOADED");
console.log("====================================");


// =====================================================
// API
// =====================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// =====================================================
// ELEMENTS
// =====================================================

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


// =====================================================
// GET SAVED BILL ID
// =====================================================

const savedBillId =
    localStorage.getItem("savedBillId");


console.log(
    "Saved Bill ID:",
    savedBillId
);


// =====================================================
// MONEY FORMAT
// =====================================================

function money(value) {

    const number =
        Number(value) || 0;

    return "₹ " + number.toFixed(2);

}


// =====================================================
// NUMBER HELPER
// =====================================================

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


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(dateValue);

    }


    return (

        String(
            date.getDate()
        ).padStart(2, "0")

        + "/" +

        String(
            date.getMonth() + 1
        ).padStart(2, "0")

        + "/" +

        date.getFullYear()

    );

}


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(dateValue) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(dateValue);


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
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );

}


// =====================================================
// GET DISCOUNT
// =====================================================

function getDiscount(bill) {

    let discount = 0;


    // -------------------------------------------------
    // DATABASE: discount_amount
    // -------------------------------------------------

    if (
        bill.discount_amount !== undefined &&
        bill.discount_amount !== null &&
        bill.discount_amount !== ""
    ) {

        discount =
            numberValue(
                bill.discount_amount
            );

    }


    // -------------------------------------------------
    // DATABASE: discount
    // -------------------------------------------------

    else if (
        bill.discount !== undefined &&
        bill.discount !== null &&
        bill.discount !== ""
    ) {

        discount =
            numberValue(
                bill.discount
            );

    }


    // -------------------------------------------------
    // LOCAL STORAGE
    // -------------------------------------------------

    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );

    }


    // -------------------------------------------------
    // OTHER LOCAL STORAGE KEY
    // -------------------------------------------------

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


// =====================================================
// GET ADVANCE AMOUNT
// =====================================================

function getAdvanceAmount(bill) {

    let advance = null;


    // -------------------------------------------------
    // DATABASE: advance_amount
    // -------------------------------------------------

    if (
        bill.advance_amount !== undefined &&
        bill.advance_amount !== null &&
        bill.advance_amount !== ""
    ) {

        advance =
            numberValue(
                bill.advance_amount
            );

    }


    // -------------------------------------------------
    // DATABASE: advance
    // -------------------------------------------------

    else if (
        bill.advance !== undefined &&
        bill.advance !== null &&
        bill.advance !== ""
    ) {

        advance =
            numberValue(
                bill.advance
            );

    }


    // -------------------------------------------------
    // LOCAL STORAGE
    // -------------------------------------------------

    if (
        advance === null ||
        !Number.isFinite(advance)
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


// =====================================================
// LOAD EXACT BILL
// =====================================================

async function loadFinalBill() {

    console.log(
        "===================================="
    );

    console.log(
        "STARTING FINAL BILL LOAD"
    );

    console.log(
        "Bill ID:",
        savedBillId
    );


    // =================================================
    // CHECK BILL ID
    // =================================================

    if (!savedBillId) {

        console.error(
            "savedBillId is missing."
        );


        if (billNoElement) {

            billNoElement.textContent =
                "---";

        }


        alert(
            "Saved bill ID is missing."
        );


        return;

    }


    try {

        // =================================================
        // LOAD EXACT BILL
        // =================================================

        const url =
            `${API_URL}/bill/${savedBillId}`;


        console.log(
            "Fetching:",
            url
        );


        const response =
            await fetch(url);


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // =================================================
        // JSON RESPONSE
        // =================================================

        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        const bill =
            result.bill || result;


        if (!bill) {

            throw new Error(
                "Bill data not found."
            );

        }


        console.log(
            "EXACT BILL:",
            bill
        );


        // =================================================
        // BILL NUMBER
        // =================================================
        // IMPORTANT:
        // DO NOT GENERATE BILL NUMBER HERE.
        // DATABASE GENERATED BILL NUMBER IS USED.
        // =================================================

        if (billNoElement) {

            billNoElement.textContent =
                bill.bill_no || "---";

        }


        if (bill.bill_no) {

            localStorage.setItem(
                "savedBillNo",
                bill.bill_no
            );

        }


        console.log(
            "DATABASE BILL NO:",
            bill.bill_no
        );


        // =================================================
        // DATE
        // =================================================

        if (billDateElement) {

            billDateElement.textContent =
                formatDate(
                    bill.bill_date
                );

        }


        // =================================================
        // TIME
        // =================================================

        let timeValue =
            bill.bill_time;


        if (!timeValue) {

            timeValue =
                bill.created_at;

        }


        if (billDayTimeElement) {

            billDayTimeElement.textContent =
                formatTime(
                    timeValue
                );

        }


        // =================================================
        // CUSTOMER
        // =================================================

        if (customerNameElement) {

            customerNameElement.textContent =
                bill.customer_name || "-";

        }


        if (customerMobileElement) {

            customerMobileElement.textContent =
                bill.customer_mobile || "-";

        }


        if (customerPlaceElement) {

            customerPlaceElement.textContent =
                bill.customer_place || "-";

        }


        console.log(
            "Customer:",
            bill.customer_name
        );

        console.log(
            "Mobile:",
            bill.customer_mobile
        );

        console.log(
            "Place:",
            bill.customer_place
        );


        // =================================================
        // WOOD TOTAL
        // =================================================

        const woodTotal =
            numberValue(
                bill.wood_total
            );


        // =================================================
        // OTHERS TOTAL
        // =================================================

        const othersTotal =
            numberValue(
                bill.others_total
            );


        // =================================================
        // SUBTOTAL
        // =================================================

        const subtotal =
            woodTotal +
            othersTotal;


        // =================================================
        // DISCOUNT
        // =================================================

        const discount =
            getDiscount(bill);


        // =================================================
        // GRAND TOTAL
        // =================================================

        let grandTotal =
            subtotal -
            discount;


        if (
            grandTotal < 0
        ) {

            grandTotal = 0;

        }


        // =================================================
        // ADVANCE
        // =================================================

        let advanceAmount =
            getAdvanceAmount(bill);


        if (
            advanceAmount > grandTotal
        ) {

            advanceAmount =
                grandTotal;

        }


        // =================================================
        // BALANCE
        // =================================================

        let balanceAmount =
            grandTotal -
            advanceAmount;


        if (
            balanceAmount < 0
        ) {

            balanceAmount = 0;

        }


        // =================================================
        // DISPLAY WOOD TOTAL
        // =================================================

        if (woodTotalElement) {

            woodTotalElement.textContent =
                money(
                    woodTotal
                );

        }


        // =================================================
        // DISPLAY OTHERS TOTAL
        // =================================================

        if (othersTotalElement) {

            othersTotalElement.textContent =
                money(
                    othersTotal
                );

        }


        // =================================================
        // DISPLAY SUBTOTAL
        // =================================================

        if (subtotalAmountElement) {

            subtotalAmountElement.textContent =
                money(
                    subtotal
                );

        }


        if (subtotalElement) {

            subtotalElement.textContent =
                money(
                    subtotal
                );

        }


        // =================================================
        // DISPLAY DISCOUNT
        // =================================================

        if (
            discount > 0
        ) {

            if (discountRow) {

                discountRow.style.display =
                    "flex";

            }


            if (discountAmountElement) {

                discountAmountElement.textContent =
                    "- " +
                    money(
                        discount
                    );

            }

        }
        else {

            if (discountRow) {

                discountRow.style.display =
                    "none";

            }

        }


        // =================================================
        // DISPLAY GRAND TOTAL
        // =================================================

        if (grandTotalElement) {

            grandTotalElement.textContent =
                money(
                    grandTotal
                );

        }


        // =================================================
        // DISPLAY ADVANCE
        // =================================================

        if (advanceAmountElement) {

            advanceAmountElement.textContent =
                money(
                    advanceAmount
                );

        }


        if (advanceRow) {

            if (
                advanceAmount > 0
            ) {

                advanceRow.style.display =
                    "flex";

            }
            else {

                advanceRow.style.display =
                    "none";

            }

        }


        // =================================================
        // DISPLAY BALANCE
        // =================================================

        if (balanceAmountElement) {

            balanceAmountElement.textContent =
                money(
                    balanceAmount
                );

        }


        // =================================================
        // WOOD DATA
        // =================================================

        let woodData =
            bill.wood_data;


        if (
            typeof woodData === "string"
        ) {

            try {

                woodData =
                    JSON.parse(
                        woodData
                    );

            }
            catch (error) {

                console.error(
                    "WOOD JSON ERROR:",
                    error
                );

                woodData = [];

            }

        }


        if (
            !Array.isArray(
                woodData
            )
        ) {

            woodData = [];

        }


        console.log(
            "===================================="
        );

        console.log(
            "WOOD DATA COUNT:",
            woodData.length
        );

        console.table(
            woodData
        );


        loadWoodData(
            woodData
        );


        // =================================================
        // OTHER CHARGES
        // =================================================

        let othersData =
            bill.others_data;


        if (
            typeof othersData === "string"
        ) {

            try {

                othersData =
                    JSON.parse(
                        othersData
                    );

            }
            catch (error) {

                console.error(
                    "OTHERS JSON ERROR:",
                    error
                );

                othersData = [];

            }

        }


        if (
            !Array.isArray(
                othersData
            )
        ) {

            othersData = [];

        }


        loadOtherCharges(
            bill,
            othersData
        );


        // =================================================
        // CFT SUMMARY
        // =================================================

        loadCftSummary(
            woodData
        );


        // =================================================
        // SAVE FINAL VALUES
        // =================================================

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


        // =================================================
        // FINAL DEBUG
        // =================================================

        console.log(
            "===================================="
        );

        console.log(
            "          FINAL BILL"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Bill No:",
            bill.bill_no
        );

        console.log(
            "Customer:",
            bill.customer_name
        );

        console.log(
            "Mobile:",
            bill.customer_mobile
        );

        console.log(
            "Place:",
            bill.customer_place
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
            "===================================="
        );

    }

    catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "CBILL LOAD ERROR:",
            error
        );

        console.error(
            "===================================="
        );


        if (billNoElement) {

            billNoElement.textContent =
                "---";

        }


        alert(
            "Unable to load final bill."
        );

    }

}


// =====================================================
// LOAD WOOD DATA
// =====================================================
// IMPORTANT:
// ONE CALCULATION = ONE MAIN ROW
//
// Example:
//
// Calculation 1
// Wood | Size | 9 → 4 | 5 → 6 | ...
//
// Calculation 2
// Wood | Size | 10 → 3 | ...
//
// NO GROUPING OF SAME WOOD.
// =====================================================

function loadWoodData(
    woodData
) {

    if (!woodTable) {

        console.error(
            "woodTable element not found."
        );

        return;

    }


    woodTable.innerHTML =
        "";


    let sno = 1;


    // =================================================
    // NO DATA
    // =================================================

    if (
        !Array.isArray(woodData) ||
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


    // =================================================
    // LOOP EVERY CALCULATION
    // =================================================

    woodData.forEach(
        function (
            item
        ) {

            if (!item) {

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
                woodName === "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            if (!woodName) {

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
                    `${breadth}`;

            }
            else if (
                thickness > 0
            ) {

                size =
                    `${thickness}`;

            }


            // =================================================
            // QUALITY
            // =================================================

            const quality =
                item.quality !== undefined &&
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
            // LENGTH + QUANTITY
            // =================================================

            let lengthValues =
                [];


            pieces.forEach(
                function (
                    piece
                ) {

                    if (!piece) {

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
            // FALLBACK DIRECT LENGTH
            // =================================================

            if (
                lengthValues.length === 0 &&
                item.length !== undefined
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
            // LENGTH TEXT
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
                                lengthItem
                            ) {

                                return `

                                    ${lengthItem.length}
                                    → ${lengthItem.qty}

                                `;

                            }
                        )
                        .join(
                            "<br>"
                        );

            }


            // =================================================
            // TOTAL QUANTITY
            // =================================================

            let totalQty =
                0;


            pieces.forEach(
                function (
                    piece
                ) {

                    if (!piece) {

                        return;

                    }


                    totalQty +=
                        numberValue(
                            piece.qty
                        );

                }
            );


            // =================================================
            // FALLBACK QUANTITY
            // =================================================

            if (
                totalQty === 0 &&
                item.qty !== undefined
            ) {

                totalQty =
                    numberValue(
                        item.qty
                    );

            }


            // =================================================
            // TOTAL LENGTH
            // =================================================

            let totalLength =
                numberValue(
                    item.totalLength
                );


            // =================================================
            // CALCULATE TOTAL LENGTH
            // =================================================

            if (
                totalLength === 0
            ) {

                pieces.forEach(
                    function (
                        piece
                    ) {

                        if (!piece) {

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


                        const qty =
                            numberValue(
                                piece.qty
                            );


                        totalLength +=
                            (
                                length +
                                extraLength
                            ) *
                            qty;

                    }
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
                    ${totalLength.toFixed(2)}
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
                sno
            );

            console.log(
                {
                    wood:
                        woodName,

                    size:
                        size,

                    lengths:
                        lengthValues,

                    quantity:
                        totalQty,

                    totalLength:
                        totalLength,

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


// =====================================================
// LOAD OTHER CHARGES
// =====================================================

function loadOtherCharges(
    bill,
    othersData
) {

    if (!chargeTable) {

        console.error(
            "chargeTable element not found."
        );

        return;

    }


    chargeTable.innerHTML =
        "";


    let sno = 1;

    let hasCharge =
        false;


    // =================================================
    // LABOUR
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

                if (!item) {

                    return;

                }


                const amount =
                    numberValue(
                        item.amount
                    );


                if (
                    amount <= 0
                ) {

                    return;

                }


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
                            item.name ||
                            item.reason ||
                            "-"
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
    // NO CHARGES
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

}


// =====================================================
// CFT SUMMARY
// EACH CALCULATION SEPARATE
// NO GROUPING
// =====================================================

function loadCftSummary(
    woodData
) {

    if (!cftSummary) {

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

        cftSummary.innerHTML = `

            <p>
                -
            </p>

        `;

        return;

    }


    woodData.forEach(
        function (
            item,
            index
        ) {

            if (!item) {

                return;

            }


            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "";


            if (
                woodName === "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            if (!woodName) {

                woodName =
                    "-";

            }


            const quality =
                item.quality !== undefined &&
                item.quality !== ""
                    ? item.quality
                    : "-";


            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            const p =
                document.createElement(
                    "p"
                );


            p.innerHTML = `

                <b>
                    ${index + 1}.
                    ${escapeHTML(
                        woodName
                    )}
                    (${escapeHTML(
                        quality
                    )})
                </b>

                <span>
                    : ${cubicFeet.toFixed(2)}
                    CFT
                </span>

            `;


            cftSummary.appendChild(
                p
            );

        }
    );

}


// =====================================================
// PRINT
// =====================================================

if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function () {

            console.log(
                "PRINT BUTTON CLICKED"
            );


            window.print();

        }
    );

}


// =====================================================
// HOME
// =====================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(
        "click",
        function () {

            console.log(
                "HOME BUTTON CLICKED"
            );


            // =================================================
            // CLEAR CURRENT BILL REFERENCES
            // =================================================

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            localStorage.removeItem(
                "discountAmount"
            );

            localStorage.removeItem(
                "discount"
            );

            localStorage.removeItem(
                "discountApplied"
            );


            localStorage.removeItem(
                "finalGrandTotal"
            );


            localStorage.removeItem(
                "paymentType"
            );

            localStorage.removeItem(
                "paymentMode"
            );


            localStorage.removeItem(
                "advanceAmount"
            );

            localStorage.removeItem(
                "balanceAmount"
            );


            localStorage.removeItem(
                "grandTotal"
            );

            localStorage.removeItem(
                "finalTotal"
            );


            // =================================================
            // GO HOME
            // =================================================

            window.location.href =
                "../html/index.html";

        }
    );

}


// =====================================================
// CLEAR ALL BILL DATA
// =====================================================

if (
    clearBtn
) {

    clearBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                window.confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (
                !confirmClear
            ) {

                return;

            }


            // =================================================
            // CENTRAL BILL DATA
            // =================================================

            localStorage.removeItem(
                "current_bill_data"
            );


            // =================================================
            // WOOD
            // =================================================

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


            // =================================================
            // LABOUR
            // =================================================

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


            // =================================================
            // PERSONAL
            // =================================================

            localStorage.removeItem(
                "personal"
            );

            localStorage.removeItem(
                "personalData"
            );

            localStorage.removeItem(
                "customerName"
            );

            localStorage.removeItem(
                "customerMobile"
            );

            localStorage.removeItem(
                "customerPlace"
            );


            // =================================================
            // ADVANCE
            // =================================================

            localStorage.removeItem(
                "advance"
            );

            localStorage.removeItem(
                "advanceData"
            );

            localStorage.removeItem(
                "advanceAmount"
            );

            localStorage.removeItem(
                "balanceAmount"
            );

            localStorage.removeItem(
                "paymentType"
            );

            localStorage.removeItem(
                "paymentMode"
            );


            // =================================================
            // DISCOUNT
            // =================================================

            localStorage.removeItem(
                "discount"
            );

            localStorage.removeItem(
                "discountData"
            );

            localStorage.removeItem(
                "discountAmount"
            );

            localStorage.removeItem(
                "discountApplied"
            );

            localStorage.removeItem(
                "billDiscount"
            );

            localStorage.removeItem(
                "finalGrandTotal"
            );


            // =================================================
            // TOTALS
            // =================================================

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


            // =================================================
            // SAVED BILL REFERENCES
            // =================================================

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            // =================================================
            // BILL STATUS
            // =================================================

            localStorage.removeItem(
                "billConfirmed"
            );

            localStorage.removeItem(
                "billConfirmedAt"
            );

            localStorage.removeItem(
                "editingBill"
            );

            localStorage.removeItem(
                "billDate"
            );


            // =================================================
            // SESSION STORAGE
            // =================================================

            sessionStorage.clear();


            console.log(
                "===================================="
            );

            console.log(
                "ALL BILL DATA CLEARED"
            );

            console.log(
                "===================================="
            );


            // =================================================
            // GO HOME
            // =================================================

            window.location.href =
                "../html/index.html";

        }
    );

}


// =====================================================
// START
// =====================================================

console.log(
    "Calling loadFinalBill()..."
);


loadFinalBill();