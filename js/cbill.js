// ============================================================
// CBILL.JS
// FINAL / SAVED BILL
// ============================================================
//
// IMPORTANT
// ------------------------------------------------------------
// 1. BILL NUMBER IS NEVER GENERATED HERE.
//    It always comes from the DATABASE.
//
// 2. CUSTOMER NUMBER / CUSTOMER ID IS NOT GENERATED HERE.
//    Existing DB value is left untouched.
//
// 3. Wood Length is displayed separately:
//       4 → 3
//       5 → 6
//       2 → 10
//
// 4. Total Length column is NOT displayed.
//
// 5. CFT summary groups:
//       SAME WOOD + SAME QUALITY
// ============================================================

console.clear();

console.log("==========================================");
console.log("             CBILL.JS LOADED");
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
    localStorage.getItem("savedBillId");

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

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// SAFE JSON
// ============================================================

function parseJSON(value, fallback = []) {

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

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "JSON PARSE ERROR:",
            error
        );

        return fallback;
    }
}


// ============================================================
// LOCAL BILL DATA
// ============================================================

function getLocalBillData() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "current_bill_data"
            ) || "{}"
        );

    } catch (error) {

        console.error(
            "current_bill_data ERROR:",
            error
        );

        return {};
    }
}


const localBillData =
    getLocalBillData();


// ============================================================
// LOCAL PERSONAL DATA
// ============================================================

const localPersonal =
    localBillData.personal || {};


// ============================================================
// LOCAL CUSTOMER
// ============================================================

function getLocalCustomer() {

    const name =
        localPersonal.name ||
        localPersonal.customerName ||
        localStorage.getItem(
            "customerName"
        ) ||
        "";

    const mobile =
        localPersonal.mobile ||
        localPersonal.customerMobile ||
        localStorage.getItem(
            "customerMobile"
        ) ||
        "";

    const place =
        localPersonal.place ||
        localPersonal.customerPlace ||
        localStorage.getItem(
            "customerPlace"
        ) ||
        "";

    return {
        name,
        mobile,
        place
    };
}


// ============================================================
// DISCOUNT
// ============================================================

function getDiscount(bill) {

    let discount = 0;


    // DATABASE FIELD 1

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


    // DATABASE FIELD 2

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


    // LOCAL STORAGE

    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );
    }


    // SECOND LOCAL FALLBACK

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
// ADVANCE
// ============================================================

function getAdvanceAmount(bill) {

    let advance = null;


    // DATABASE

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


    // DATABASE SECOND FIELD

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


    // LOCAL FALLBACK

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


// ============================================================
// DATE
// ============================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(value);
    }

    return (
        String(
            date.getDate()
        ).padStart(2, "0") +
        "/" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "/" +
        date.getFullYear()
    );
}


// ============================================================
// TIME
// ============================================================

function formatTime(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

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


// ============================================================
// GET WOOD NAME
// ============================================================

function getWoodName(item) {

    let name =
        item.woodType ||
        item.wood ||
        item.woodName ||
        "";

    if (
        name === "Other"
    ) {

        name =
            item.otherWood ||
            "Other";
    }

    return name || "-";
}


// ============================================================
// GET QUALITY
// ============================================================

function getQuality(item) {

    if (
        item.quality !== undefined &&
        item.quality !== null &&
        item.quality !== ""
    ) {

        return String(
            item.quality
        );
    }

    return "-";
}


// ============================================================
// GET SIZE
// ============================================================

function getSize(item) {

    const breadth =
        numberValue(
            item.breadth
        );

    const thickness =
        numberValue(
            item.thickness
        );


    if (
        breadth > 0 &&
        thickness > 0
    ) {

        return (
            breadth +
            " × " +
            thickness
        );
    }


    if (
        breadth > 0
    ) {

        return String(
            breadth
        );
    }


    if (
        thickness > 0
    ) {

        return String(
            thickness
        );
    }


    return "-";
}


// ============================================================
// GET LENGTH / QUANTITY
// ============================================================
//
// Output:
// 4 → 3
// 5 → 6
// 2 → 10
//
// ============================================================

function getLengthValues(item) {

    const pieces =
        Array.isArray(item.pieces)
            ? item.pieces
            : [];


    const values = [];


    pieces.forEach(
        function(piece) {

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

                values.push({
                    length: finalLength,
                    qty: qty
                });
            }
        }
    );


    // DIRECT FALLBACK

    if (
        values.length === 0 &&
        item.length !== undefined
    ) {

        const length =
            numberValue(
                item.length
            );

        const qty =
            numberValue(
                item.qty
            );


        if (
            length > 0
        ) {

            values.push({
                length,
                qty
            });
        }
    }


    return values;
}


// ============================================================
// TOTAL QUANTITY
// ============================================================

function getTotalQty(item) {

    const pieces =
        Array.isArray(item.pieces)
            ? item.pieces
            : [];


    let totalQty = 0;


    pieces.forEach(
        function(piece) {

            if (!piece) {
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
        item.qty !== undefined
    ) {

        totalQty =
            numberValue(
                item.qty
            );
    }


    return totalQty;
}


// ============================================================
// LOAD WOOD DATA
// ============================================================
//
// IMPORTANT:
// Total Length column removed.
// ============================================================

function loadWoodData(woodData) {

    if (!woodTable) {

        console.error(
            "woodTable not found."
        );

        return;
    }


    woodTable.innerHTML = "";


    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        woodTable.innerHTML = `
            <tr>
                <td colspan="9">
                    No wood data
                </td>
            </tr>
        `;

        return;
    }


    let sno = 1;


    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const woodName =
                getWoodName(item);


            const size =
                getSize(item);


            const quality =
                getQuality(item);


            const lengthValues =
                getLengthValues(item);


            const totalQty =
                getTotalQty(item);


            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            const rate =
                numberValue(
                    item.rate
                );


            const amount =
                numberValue(
                    item.amount
                );


            // ----------------------------------------------------
            // LENGTH DISPLAY
            // ----------------------------------------------------

            let lengthText = "-";


            if (
                lengthValues.length > 0
            ) {

                lengthText =
                    lengthValues
                        .map(
                            function(value) {

                                return `
                                    <div class="wood-length-item">
                                        ${escapeHTML(value.length)}
                                        → 
                                        ${escapeHTML(value.qty)}
                                    </div>
                                `;
                            }
                        )
                        .join("");
            }


            // ----------------------------------------------------
            // ROW
            // ----------------------------------------------------

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

                <td class="length-cell">
                    ${lengthText}
                </td>

                <td>
                    ${totalQty}
                </td>

                <td>
                    ${cubicFeet.toFixed(2)}
                </td>

                <td>
                    ${money(rate)}
                </td>

                <td>
                    ${money(amount)}
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
                "WOOD ROW:",
                {
                    sno,
                    woodName,
                    size,
                    lengths:
                        lengthValues,
                    qty:
                        totalQty,
                    cft:
                        cubicFeet,
                    rate,
                    amount,
                    quality
                }
            );


            sno++;
        }
    );
}


// ============================================================
// OTHER CHARGES
// ============================================================

function loadOtherCharges(
    bill,
    othersData
) {

    if (!chargeTable) {

        console.error(
            "chargeTable not found."
        );

        return;
    }


    chargeTable.innerHTML = "";


    let sno = 1;

    let hasCharge = false;


    // ========================================================
    // LABOUR CHARGE
    // ========================================================

    const labour =
        numberValue(
            bill.labour_charge
        );


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
                ${money(labour)}
            </td>

        `;


        chargeTable.appendChild(
            row
        );
    }


    // ========================================================
    // OTHER CHARGE
    // ========================================================

    const otherCharge =
        numberValue(
            bill.other_charge
        );


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
                ${money(otherCharge)}
            </td>

        `;


        chargeTable.appendChild(
            row
        );
    }


    // ========================================================
    // ADDITIONAL CHARGES
    // ========================================================

    if (
        Array.isArray(othersData)
    ) {

        othersData.forEach(
            function(item) {

                if (!item) {
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
                        ${escapeHTML(name)}
                    </td>

                    <td>
                        ${money(amount)}
                    </td>

                `;


                chargeTable.appendChild(
                    row
                );
            }
        );
    }


    // ========================================================
    // NO CHARGES
    // ========================================================

    if (
        !hasCharge
    ) {

        chargeTable.innerHTML = `

            <tr>

                <td>-</td>

                <td>-</td>

                <td>-</td>

            </tr>

        `;
    }
}


// ============================================================
// CFT SUMMARY
// ============================================================
//
// SAME WOOD + SAME QUALITY = ONE LINE
//
// Example:
//
// Teak (1)   3.06 CFT
// Teak (2)  11.65 CFT
//
// ============================================================

function loadCftSummary(woodData) {

    if (!cftSummary) {

        console.error(
            "cftSummary not found."
        );

        return;
    }


    cftSummary.innerHTML = "";


    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        cftSummary.innerHTML =
            "<p>-</p>";

        return;
    }


    // ========================================================
    // GROUP
    // ========================================================

    const groups =
        new Map();


    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const woodName =
                getWoodName(item);


            const quality =
                getQuality(item);


            const cft =
                numberValue(
                    item.cubicFeet
                );


            const key =
                woodName +
                "||" +
                quality;


            if (
                !groups.has(key)
            ) {

                groups.set(
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


            groups.get(key).cft +=
                cft;
        }
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    let index = 1;


    groups.forEach(
        function(group) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cft-summary-row";


            row.innerHTML = `

                <span class="cft-name">

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

                <span class="cft-value">

                    ${group.cft.toFixed(2)}
                    CFT

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
// LOAD FINAL BILL
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


    // ========================================================
    // SAVED BILL ID
    // ========================================================

    if (
        !savedBillId
    ) {

        console.error(
            "savedBillId is missing."
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


        if (!bill) {

            throw new Error(
                "Bill not found."
            );
        }


        console.log(
            "FINAL DATABASE BILL:",
            bill
        );


        // ====================================================
        // BILL NUMBER
        // ====================================================
        //
        // DO NOT GENERATE.
        // DO NOT MODIFY.
        // DATABASE ONLY.
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
        // DATABASE FIRST.
        // LOCAL STORAGE SECOND.
        //
        // CUSTOMER NUMBER / CUSTOMER ID IS NOT GENERATED.
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
        // DISPLAY WOOD TOTAL
        // ====================================================

        if (
            woodTotalElement
        ) {

            woodTotalElement.textContent =
                money(
                    woodTotal
                );
        }


        // ====================================================
        // DISPLAY OTHER TOTAL
        // ====================================================

        if (
            othersTotalElement
        ) {

            othersTotalElement.textContent =
                money(
                    othersTotal
                );
        }


        // ====================================================
        // DISPLAY SUBTOTAL
        // ====================================================

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

        } else {

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
        // LOCAL WOOD FALLBACK
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


        // ====================================================
        // DISPLAY WOOD
        // ====================================================

        loadWoodData(
            woodData
        );


        // ====================================================
        // OTHER CHARGES DATA
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
        // LOCAL OTHER DATA FALLBACK
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


            if (
                Array.isArray(
                    localOthers
                )
            ) {

                othersData =
                    localOthers;
            }


            if (
                Array.isArray(
                    localLabour.charges
                )
            ) {

                othersData =
                    localLabour.charges;
            }
        }


        // ====================================================
        // DISPLAY CHARGES
        // ====================================================

        loadOtherCharges(
            bill,
            othersData
        );


        // ====================================================
        // CFT SUMMARY
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


        localStorage.setItem(
            "subtotal",
            String(
                subtotal
            )
        );


        localStorage.setItem(
            "woodTotal",
            String(
                woodTotal
            )
        );


        localStorage.setItem(
            "othersTotal",
            String(
                othersTotal
            )
        );


        // ====================================================
        // DEBUG
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


    } catch (error) {

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
// PRINT
// ============================================================

if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function() {

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
        function() {

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
        function() {

            const ok =
                confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (!ok) {
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


            // IMPORTANT:
            // Existing customer ID is only cleared
            // because this is the existing CLEAR behavior.
            // No new customer ID is generated.

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
// START
// ============================================================

console.log(
    "STARTING CBILL..."
);

loadFinalBill();
