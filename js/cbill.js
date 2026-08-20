// =====================================================
// CBILL.JS
// FINAL SAVED BILL
// =====================================================


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

const discountRow =
    document.getElementById("discountRow");

const discountAmountElement =
    document.getElementById("discountAmount");

const grandTotalElement =
    document.getElementById("grandTotal");

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


    // =================================================
    // DATABASE: discount_amount
    // =================================================

    if (
        bill.discount_amount !== undefined &&
        bill.discount_amount !== null &&
        bill.discount_amount !== ""
    ) {

        discount =
            Number(
                bill.discount_amount
            ) || 0;

    }


    // =================================================
    // DATABASE: discount
    // =================================================

    else if (
        bill.discount !== undefined &&
        bill.discount !== null &&
        bill.discount !== ""
    ) {

        discount =
            Number(
                bill.discount
            ) || 0;

    }


    // =================================================
    // LOCAL STORAGE
    // =================================================

    else {

        const localDiscount =
            localStorage.getItem(
                "discountAmount"
            );


        if (
            localDiscount !== null &&
            localDiscount !== ""
        ) {

            discount =
                Number(
                    localDiscount
                ) || 0;

        }

    }


    // =================================================
    // OTHER LOCAL STORAGE KEY
    // =================================================

    if (discount === 0) {

        const localDiscount =
            localStorage.getItem(
                "discount"
            );


        if (
            localDiscount !== null &&
            localDiscount !== ""
        ) {

            discount =
                Number(
                    localDiscount
                ) || 0;

        }

    }


    // =================================================
    // PREVENT NEGATIVE DISCOUNT
    // =================================================

    if (discount < 0) {

        discount = 0;

    }


    return discount;

}


// =====================================================
// GET ADVANCE AMOUNT
// =====================================================

function getAdvanceAmount(bill) {

    let advance = null;


    // =================================================
    // 1. DATABASE: advance_amount
    // =================================================

    if (
        bill.advance_amount !== undefined &&
        bill.advance_amount !== null &&
        bill.advance_amount !== ""
    ) {

        advance =
            Number(
                bill.advance_amount
            );

    }


    // =================================================
    // 2. DATABASE: advance
    // =================================================

    else if (
        bill.advance !== undefined &&
        bill.advance !== null &&
        bill.advance !== ""
    ) {

        advance =
            Number(
                bill.advance
            );

    }


    // =================================================
    // 3. LOCAL STORAGE
    // =================================================

    if (
        advance === null ||
        !Number.isFinite(advance)
    ) {

        advance =
            Number(
                localStorage.getItem(
                    "advanceAmount"
                )
            ) || 0;

    }


    // =================================================
    // PREVENT NEGATIVE ADVANCE
    // =================================================

    if (advance < 0) {

        advance = 0;

    }


    return advance;

}


// =====================================================
// LOAD EXACT BILL
// =====================================================

async function loadFinalBill() {


    if (!savedBillId) {

        console.error(
            "savedBillId is missing"
        );


        if (billNoElement) {

            billNoElement.textContent =
                "---";

        }


        return;

    }


    try {


        // =================================================
        // LOAD BILL
        // =================================================

        console.log(
            "Loading exact bill:",
            savedBillId
        );


        const response =
            await fetch(
                `${API_URL}/bill/${savedBillId}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // =================================================
        // RESPONSE
        // =================================================

        const result =
            await response.json();


        console.log(
            "Database response:",
            result
        );


        const bill =
            result.bill || result;


        if (!bill) {

            throw new Error(
                "Bill data not found"
            );

        }


        // =================================================
        // BILL NUMBER
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


        // =================================================
        // WOOD TOTAL
        // =================================================

        const woodTotal =
            Number(
                bill.wood_total
            ) || 0;


        // =================================================
        // OTHERS TOTAL
        // =================================================

        const othersTotal =
            Number(
                bill.others_total
            ) || 0;


        // =================================================
        // SUBTOTAL
        //
        // Wood Total + Others Total
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
        //
        // Subtotal - Discount
        // =================================================

        let grandTotal =
            subtotal -
            discount;


        // =================================================
        // PREVENT NEGATIVE GRAND TOTAL
        // =================================================

        if (grandTotal < 0) {

            grandTotal = 0;

        }


        // =================================================
        // ADVANCE AMOUNT
        //
        // Get from database or localStorage
        // =================================================

        const advanceAmount =
            getAdvanceAmount(bill);


        // =================================================
        // BALANCE AMOUNT
        //
        // Grand Total - Advance
        // =================================================

        let balanceAmount =
            grandTotal -
            advanceAmount;


        // =================================================
        // PREVENT NEGATIVE BALANCE
        // =================================================

        if (balanceAmount < 0) {

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


        // =================================================
        // DISPLAY DISCOUNT
        // =================================================

        if (discount > 0) {

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
        // DISPLAY ADVANCE AMOUNT
        // =================================================

        if (advanceAmountElement) {

            advanceAmountElement.textContent =
                money(
                    advanceAmount
                );

        }


        // =================================================
        // DISPLAY BALANCE AMOUNT
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
            typeof woodData ===
            "string"
        ) {

            try {

                woodData =
                    JSON.parse(
                        woodData
                    );

            }

            catch (error) {

                console.error(
                    "Wood JSON error:",
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


        loadWoodData(
            woodData
        );


        // =================================================
        // OTHER CHARGES
        // =================================================

        let othersData =
            bill.others_data;


        if (
            typeof othersData ===
            "string"
        ) {

            try {

                othersData =
                    JSON.parse(
                        othersData
                    );

            }

            catch (error) {

                console.error(
                    "Others JSON error:",
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
        // DEBUG
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "FINAL BILL LOADED"
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
            "Advance Amount:",
            advanceAmount
        );

        console.log(
            "Balance Amount:",
            balanceAmount
        );

        console.log(
            "================================="
        );


    }

    catch (error) {


        console.error(
            "CBILL LOAD ERROR:",
            error
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

function loadWoodData(
    woodData
) {


    if (!woodTable) {

        return;

    }


    woodTable.innerHTML =
        "";


    let sno = 1;


    // =================================================
    // NO DATA
    // =================================================

    if (
        woodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    -
                </td>

            </tr>

        `;


        return;

    }


    // =================================================
    // LOOP WOOD
    // =================================================

    woodData.forEach(
        function(item) {


            // =================================================
            // NO PIECES
            // =================================================

            if (
                !item.pieces ||
                item.pieces.length === 0
            ) {


                const row =
                    document.createElement(
                        "tr"
                    );


                const woodName =
                    item.woodType === "Other"
                        ? item.otherWood
                        : item.woodType;


                row.innerHTML = `

                    <td>
                        ${sno}
                    </td>

                    <td>
                        ${woodName || "-"}
                    </td>

                    <td>
                        ${item.breadth || 0}
                        ×
                        ${item.thickness || 0}
                    </td>

                    <td>
                        -
                    </td>

                    <td>
                        -
                    </td>

                    <td>
                        ${Number(
                            item.totalLength || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${Number(
                            item.cubicFeet || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${money(
                            item.rate
                        )}
                    </td>

                    <td>
                        ${money(
                            item.amount
                        )}
                    </td>

                    <td>
                        ${item.quality || "-"}
                    </td>

                `;


                woodTable.appendChild(
                    row
                );


                sno++;


                return;

            }


            // =================================================
            // PIECES
            // =================================================

            item.pieces.forEach(
                function(
                    piece,
                    index
                ) {


                    const row =
                        document.createElement(
                            "tr"
                        );


                    const length =
                        Number(
                            piece.length || 0
                        )
                        +
                        Number(
                            piece.extraLength || 0
                        );


                    // =================================================
                    // FIRST PIECE
                    // =================================================

                    if (
                        index === 0
                    ) {


                        const woodName =
                            item.woodType === "Other"
                                ? item.otherWood
                                : item.woodType;


                        row.innerHTML = `

                            <td>
                                ${sno}
                            </td>

                            <td>
                                ${woodName || "-"}
                            </td>

                            <td>
                                ${item.breadth || 0}
                                ×
                                ${item.thickness || 0}
                            </td>

                            <td>
                                ${length}
                            </td>

                            <td>
                                ${piece.qty || 0}
                            </td>

                            <td>
                                ${Number(
                                    piece.totalLength || 0
                                ).toFixed(2)}
                            </td>

                            <td>
                                ${Number(
                                    item.cubicFeet || 0
                                ).toFixed(2)}
                            </td>

                            <td>
                                ${money(
                                    item.rate
                                )}
                            </td>

                            <td>
                                ${money(
                                    item.amount
                                )}
                            </td>

                            <td>
                                ${item.quality || "-"}
                            </td>

                        `;

                    }


                    // =================================================
                    // ADDITIONAL PIECE
                    // =================================================

                    else {


                        row.innerHTML = `

                            <td></td>

                            <td></td>

                            <td></td>

                            <td>
                                ${length}
                            </td>

                            <td>
                                ${piece.qty || 0}
                            </td>

                            <td>
                                ${Number(
                                    piece.totalLength || 0
                                ).toFixed(2)}
                            </td>

                            <td></td>

                            <td></td>

                            <td></td>

                            <td></td>

                        `;

                    }


                    woodTable.appendChild(
                        row
                    );

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

        return;

    }


    chargeTable.innerHTML =
        "";


    let sno = 1;

    let hasCharge = false;


    // =================================================
    // LABOUR
    // =================================================

    const labour =
        Number(
            bill.labour_charge
        ) || 0;


    if (
        labour > 0
    ) {

        hasCharge = true;


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
        Number(
            bill.other_charge
        ) || 0;


    if (
        otherCharge > 0
    ) {

        hasCharge = true;


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

    othersData.forEach(
        function(item) {


            if (!item) {

                return;

            }


            const amount =
                Number(
                    item.amount
                ) || 0;


            if (
                amount <= 0
            ) {

                return;

            }


            hasCharge = true;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${sno++}
                </td>

                <td>
                    ${item.name || "-"}
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
// =====================================================

function loadCftSummary(
    woodData
) {


    if (!cftSummary) {

        return;

    }


    cftSummary.innerHTML =
        "";


    const summary = {};


    woodData.forEach(
        function(item) {


            let name =
                item.woodType;


            if (
                name === "Other"
            ) {

                name =
                    item.otherWood;

            }


            if (!name) {

                name =
                    "Unknown";

            }


            const cft =
                Number(
                    item.cubicFeet || 0
                );


            if (
                summary[name] !==
                undefined
            ) {

                summary[name] +=
                    cft;

            }

            else {

                summary[name] =
                    cft;

            }

        }
    );


    Object.keys(
        summary
    ).forEach(
        function(name) {


            const p =
                document.createElement(
                    "p"
                );


            p.innerHTML = `

                <b>
                    ${name}
                </b>

                <span>
                    : ${summary[name].toFixed(2)}
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

if (printBtn) {

    printBtn.addEventListener(
        "click",
        function() {

            window.print();

        }
    );

}


// =====================================================
// HOME
// =====================================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function() {


            // =================================================
            // CLEAR CURRENT BILL DATA
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
// START
// =====================================================

loadFinalBill();
