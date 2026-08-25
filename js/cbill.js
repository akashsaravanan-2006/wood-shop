// ============================================================
// CBILL.JS
// FINAL SAVED BILL - COMPLETE VERSION
// PART 1 OF 2
// ============================================================

console.clear();

console.log("==========================================");
console.log("           CBILL.JS LOADED");
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

const otherChargesSection =
    document.getElementById("otherChargesSection");

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

const whatsappBtn =
    document.getElementById("whatsappBtn");

// ============================================================
// SAVED BILL ID
// ============================================================

const savedBillId =
    localStorage.getItem("savedBillId");

console.log("SAVED BILL ID:", savedBillId);

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
// MONEY FORMAT
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
// DATE FORMAT
// ============================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return String(dateValue);
    }

    return (
        String(date.getDate()).padStart(2, "0") +
        "/" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "/" +
        date.getFullYear()
    );
}

// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
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
// DISCOUNT
// ============================================================

function getDiscount(bill) {

    let discount = 0;

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
    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );
    }

    if (discount === 0) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discount"
                )
            );
    }

    if (discount < 0) {
        discount = 0;
    }

    return discount;
}

// ============================================================
// ADVANCE
// ============================================================

function getAdvanceAmount(bill) {

    let advance = null;

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

    if (advance < 0) {
        advance = 0;
    }

    return advance;
}

// ============================================================
// PARSE JSON
// ============================================================

function parseJSON(value, fallback) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    if (typeof value !== "string") {
        return value;
    }

    try {

        return JSON.parse(value);

    }
    catch (error) {

        console.error(
            "JSON PARSE ERROR:",
            error
        );

        return fallback;
    }
}

// ============================================================
// GET WOOD DATA
// ============================================================

function getWoodData(bill) {

    let woodData =
        parseJSON(
            bill.wood_data,
            []
        );

    if (!Array.isArray(woodData)) {

        woodData =
            parseJSON(
                bill.woodData,
                []
            );
    }

    if (!Array.isArray(woodData)) {

        woodData =
            parseJSON(
                bill.wood,
                []
            );
    }

    if (!Array.isArray(woodData)) {
        woodData = [];
    }

    return woodData;
}

// ============================================================
// GET OTHER CHARGES
// ============================================================

function getOthersData(bill) {

    let othersData = [];

    if (
        bill.others_data !== undefined
    ) {

        othersData =
            parseJSON(
                bill.others_data,
                []
            );
    }

    if (!Array.isArray(othersData)) {

        othersData =
            parseJSON(
                bill.other_data,
                []
            );
    }

    if (!Array.isArray(othersData)) {

        othersData =
            parseJSON(
                bill.charges,
                []
            );
    }

    if (!Array.isArray(othersData)) {

        othersData =
            parseJSON(
                bill.additional_charges,
                []
            );
    }

    if (!Array.isArray(othersData)) {
        othersData = [];
    }

    return othersData;
}

// ============================================================
// LOAD FINAL BILL
// ============================================================

async function loadFinalBill() {

    console.log(
        "=========================================="
    );

    console.log(
        "STARTING FINAL BILL LOAD"
    );

    console.log(
        "=========================================="
    );

    if (!savedBillId) {

        console.error(
            "ERROR: savedBillId is missing."
        );

        if (billNoElement) {
            billNoElement.textContent = "---";
        }

        alert(
            "Saved bill ID is missing."
        );

        return;
    }

    try {

        const url =
            `${API_URL}/bill/${savedBillId}`;

        console.log(
            "FETCH URL:",
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

        const result =
            await response.json();

        console.log(
            "FULL DATABASE RESPONSE:",
            result
        );

        const bill =
            result.bill ||
            result.data ||
            result;

        if (
            !bill ||
            typeof bill !== "object"
        ) {

            throw new Error(
                "Bill data not found."
            );
        }

        // ====================================================
        // BILL NUMBER
        // IMPORTANT:
        // DATABASE BILL NUMBER IS USED.
        // DO NOT GENERATE A NEW BILL NUMBER.
        // ====================================================

        if (billNoElement) {

            billNoElement.textContent =
                bill.bill_no ||
                bill.billNumber ||
                "---";
        }

        if (bill.bill_no) {

            localStorage.setItem(
                "savedBillNo",
                bill.bill_no
            );
        }

        console.log(
            "DATABASE BILL NUMBER:",
            bill.bill_no
        );

        // ====================================================
        // DATE
        // ====================================================

        if (billDateElement) {

            billDateElement.textContent =
                formatDate(
                    bill.bill_date ||
                    bill.date ||
                    bill.created_at
                );
        }

        // ====================================================
        // TIME
        // ====================================================

        const timeValue =
            bill.bill_time ||
            bill.time ||
            bill.created_at;

        if (billDayTimeElement) {

            billDayTimeElement.textContent =
                formatTime(timeValue);
        }

        // ====================================================
        // CUSTOMER
        // ====================================================

        if (customerNameElement) {

            customerNameElement.textContent =
                bill.customer_name ||
                bill.customerName ||
                "-";
        }

        if (customerMobileElement) {

            customerMobileElement.textContent =
                bill.customer_mobile ||
                bill.customerMobile ||
                "-";
        }

        if (customerPlaceElement) {

            customerPlaceElement.textContent =
                bill.customer_place ||
                bill.customerPlace ||
                "-";
        }

        console.log(
            "CUSTOMER:",
            bill.customer_name
        );

        console.log(
            "MOBILE:",
            bill.customer_mobile
        );

        console.log(
            "PLACE:",
            bill.customer_place
        );

        // ====================================================
        // TOTALS
        // ====================================================

        const woodTotal =
            numberValue(
                bill.wood_total
            );

        const othersTotal =
            numberValue(
                bill.others_total
            );

        const subtotal =
            woodTotal +
            othersTotal;

        const discount =
            getDiscount(bill);

        let grandTotal =
            subtotal -
            discount;

        if (grandTotal < 0) {
            grandTotal = 0;
        }

        let advanceAmount =
            getAdvanceAmount(bill);

        if (advanceAmount > grandTotal) {
            advanceAmount = grandTotal;
        }

        let balanceAmount =
            grandTotal -
            advanceAmount;

        if (balanceAmount < 0) {
            balanceAmount = 0;
        }

        // ====================================================
        // DISPLAY TOTALS
        // ====================================================

        if (woodTotalElement) {

            woodTotalElement.textContent =
                money(woodTotal);
        }

        if (othersTotalElement) {

            othersTotalElement.textContent =
                money(othersTotal);
        }

        if (subtotalAmountElement) {

            subtotalAmountElement.textContent =
                money(subtotal);
        }

        if (subtotalElement) {

            subtotalElement.textContent =
                money(subtotal);
        }

        // ====================================================
        // DISCOUNT
        // ====================================================

        if (discount > 0) {

            if (discountRow) {
                discountRow.style.display = "flex";
            }

            if (discountAmountElement) {

                discountAmountElement.textContent =
                    "- " +
                    money(discount);
            }

        }
        else {

            if (discountRow) {
                discountRow.style.display = "none";
            }
        }

        // ====================================================
        // GRAND TOTAL
        // ====================================================

        if (grandTotalElement) {

            grandTotalElement.textContent =
                money(grandTotal);
        }

        // ====================================================
        // ADVANCE
        // ====================================================

        if (advanceAmountElement) {

            advanceAmountElement.textContent =
                money(advanceAmount);
        }

        if (advanceRow) {

            advanceRow.style.display =
                advanceAmount > 0
                    ? "flex"
                    : "none";
        }

        // ====================================================
        // BALANCE
        // ====================================================

        if (balanceAmountElement) {

            balanceAmountElement.textContent =
                money(balanceAmount);
        }

        // ====================================================
        // WOOD DATA
        // ====================================================

        const woodData =
            getWoodData(bill);

        console.log(
            "WOOD DATA:",
            woodData
        );

        loadWoodData(
            woodData
        );

        // ====================================================
        // OTHER CHARGES
        // ====================================================

        const othersData =
            getOthersData(bill);

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
        // SAVE VALUES
        // ====================================================

        localStorage.setItem(
            "grandTotal",
            String(grandTotal)
        );

        localStorage.setItem(
            "finalTotal",
            String(grandTotal)
        );

        localStorage.setItem(
            "balanceAmount",
            String(balanceAmount)
        );

        console.log(
            "=========================================="
        );

        console.log(
            "FINAL BILL LOADED"
        );

        console.log(
            "Bill No:",
            bill.bill_no
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
            "=========================================="
        );

    }
    catch (error) {

        console.error(
            "CBILL LOAD ERROR:",
            error
        );

        if (billNoElement) {
            billNoElement.textContent = "---";
        }

        alert(
            "Unable to load final bill."
        );
    }
}

// ============================================================
// LOAD WOOD DATA
// ============================================================

function loadWoodData(woodData) {

    if (!woodTable) {

        console.error(
            "woodTable element not found."
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
                <td colspan="10">
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

            // ==================================================
            // WOOD NAME
            // ==================================================

            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "";

            if (woodName === "Other") {

                woodName =
                    item.otherWood ||
                    item.woodName ||
                    "Other";
            }

            if (!woodName) {
                woodName = "-";
            }

            // ==================================================
            // SIZE
            // ==================================================

            const breadth =
                numberValue(
                    item.breadth
                );

            const thickness =
                numberValue(
                    item.thickness
                );

            let size = "-";

            if (
                breadth > 0 &&
                thickness > 0
            ) {

                size =
                    `${breadth} × ${thickness}`;

            }
            else if (breadth > 0) {

                size =
                    String(breadth);

            }
            else if (thickness > 0) {

                size =
                    String(thickness);
            }

            // ==================================================
            // QUALITY
            // ==================================================

            const quality =
                item.quality !== undefined &&
                item.quality !== ""
                    ? item.quality
                    : "-";

            // ==================================================
            // PIECES
            // ==================================================

            const pieces =
                Array.isArray(item.pieces)
                    ? item.pieces
                    : [];

            // ==================================================
            // LENGTH DATA
            // ==================================================

            let lengthValues = [];

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

                    if (finalLength > 0) {

                        lengthValues.push({

                            length:
                                finalLength,

                            qty:
                                qty
                        });
                    }
                }
            );

            // ==================================================
            // DIRECT LENGTH FALLBACK
            // ==================================================

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

                if (directLength > 0) {

                    lengthValues.push({

                        length:
                            directLength,

                        qty:
                            directQty
                    });
                }
            }

            // ==================================================
            // LENGTH DISPLAY
            // ==================================================

            let lengthText = "-";

            if (lengthValues.length > 0) {

                lengthText =
                    lengthValues
                        .map(
                            function(lengthItem) {

                                return (
                                    `${lengthItem.length} → ${lengthItem.qty}`
                                );

                            }
                        )
                        .join("<br>");
            }

            // ==================================================
            // TOTAL QUANTITY
            // ==================================================

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

            // ==================================================
            // TOTAL LENGTH
            // ==================================================

            let totalLength =
                numberValue(
                    item.totalLength
                );

            if (totalLength === 0) {

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

            // ==================================================
            // CFT
            // ==================================================

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );

            // ==================================================
            // RATE
            // ==================================================

            const rate =
                numberValue(
                    item.rate
                );

            // ==================================================
            // AMOUNT
            // ==================================================

            const amount =
                numberValue(
                    item.amount
                );

            // ==================================================
            // CREATE ROW
            // ==================================================

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>
                    ${sno}
                </td>

                <td>
                    ${escapeHTML(woodName)}
                </td>

                <td>
                    ${escapeHTML(size)}
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
                    ${money(rate)}
                </td>

                <td>
                    ${money(amount)}
                </td>

                <td>
                    ${escapeHTML(quality)}
                </td>

            `;

            woodTable.appendChild(row);

            sno++;
        }
    );
}

// ============================================================
// LOAD OTHER CHARGES
// ============================================================

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

    if (labour > 0) {

        hasCharge = true;

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${sno}
            </td>

            <td>
                Labour Charge
            </td>

            <td>
                ${money(labour)}
            </td>

        `;

        chargeTable.appendChild(row);

        sno++;
    }

    // ========================================================
    // OTHER CHARGE
    // ========================================================

    const otherCharge =
        numberValue(
            bill.other_charge
        );

    if (otherCharge > 0) {

        hasCharge = true;

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${sno}
            </td>

            <td>
                Other Charge
            </td>

            <td>
                ${money(otherCharge)}
            </td>

        `;

        chargeTable.appendChild(row);

        sno++;
    }

    // ========================================================
    // ADDITIONAL CHARGES
    // ========================================================

    if (Array.isArray(othersData)) {

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

                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";

                if (amount <= 0) {
                    return;
                }

                hasCharge = true;

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${sno}
                    </td>

                    <td>
                        ${escapeHTML(name)}
                    </td>

                    <td>
                        ${money(amount)}
                    </td>

                `;

                chargeTable.appendChild(row);

                sno++;
            }
        );
    }

    // ========================================================
    // SHOW / HIDE
    // ========================================================

    if (otherChargesSection) {

        otherChargesSection.style.display =
            hasCharge
                ? ""
                : "none";
    }
}

// ============================================================
// CFT SUMMARY
// ============================================================
// IMPORTANT:
// SAME WOOD + SAME QUALITY = ADD CFT
//
// Example:
//
// Teak quality 1 = 3.06
// Teak quality 2 = 3.65
// Teak quality 2 = 8.00
//
// Result:
//
// Teak (1) = 3.06 CFT
// Teak (2) = 11.65 CFT
// ============================================================

function loadCftSummary(woodData) {

    if (!cftSummary) {
        return;
    }

    cftSummary.innerHTML = "";

    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        cftSummary.innerHTML = `
            <p>-</p>
        `;

        return;
    }

    const grouped = {};

    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }

            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "";

            if (woodName === "Other") {

                woodName =
                    item.otherWood ||
                    item.woodName ||
                    "Other";
            }

            if (!woodName) {
                woodName = "-";
            }

            const quality =
                item.quality !== undefined &&
                item.quality !== ""
                    ? String(item.quality)
                    : "-";

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );

            const key =
                `${woodName}|||${quality}`;

            if (!grouped[key]) {

                grouped[key] = {
                    woodName:
                        woodName,

                    quality:
                        quality,

                    cft:
                        0
                };
            }

            grouped[key].cft +=
                cubicFeet;
        }
    );

    const groups =
        Object.values(grouped);

    groups.forEach(
        function(group, index) {

            const p =
                document.createElement("p");

            p.innerHTML = `

                <b>
                    ${index + 1}.
                    ${escapeHTML(group.woodName)}
                    (${escapeHTML(group.quality)})
                </b>

                <span>
                    ${group.cft.toFixed(2)} CFT
                </span>

            `;

            cftSummary.appendChild(p);
        }
    );// ============================================================
// PART 2 OF 2
// ============================================================


// ============================================================
// CONTINUE WOOD DATA
// ============================================================

woodData.forEach(
    function (
        item
    ) {

        if (
            !item
        ) {

            return;

        }


        // ==================================================
        // WOOD NAME
        // ==================================================

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
                item.woodName ||
                "Other";

        }


        if (
            !woodName
        ) {

            woodName = "-";

        }


        // ==================================================
        // SIZE
        // ==================================================

        const breadth =
            numberValue(
                item.breadth
            );


        const thickness =
            numberValue(
                item.thickness
            );


        let size = "-";


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


        // ==================================================
        // QUALITY
        // ==================================================

        const quality =
            item.quality !== undefined &&
            item.quality !== ""
                ? item.quality
                : "-";


        // ==================================================
        // PIECES
        // ==================================================

        const pieces =
            Array.isArray(
                item.pieces
            )
                ? item.pieces
                : [];


        // ==================================================
        // LENGTH VALUES
        // ==================================================

        let lengthValues = [];


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


        // ==================================================
        // DIRECT LENGTH FALLBACK
        // ==================================================

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


        // ==================================================
        // LENGTH DISPLAY
        // ==================================================

        let lengthText = "-";


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
                                <div class="wood-length-item">
                                    <span class="wood-length">
                                        ${escapeHTML(
                                            lengthItem.length
                                        )}
                                    </span>

                                    <span class="wood-arrow">
                                        →
                                    </span>

                                    <span class="wood-qty">
                                        ${escapeHTML(
                                            lengthItem.qty
                                        )}
                                    </span>
                                </div>
                            `;

                        }
                    )
                    .join("");

        }


        // ==================================================
        // TOTAL QUANTITY
        // ==================================================

        let totalQty = 0;


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
            item.qty !== undefined
        ) {

            totalQty =
                numberValue(
                    item.qty
                );

        }


        // ==================================================
        // CFT
        // ==================================================

        const cubicFeet =
            numberValue(
                item.cubicFeet
            );


        // ==================================================
        // RATE
        // ==================================================

        const rate =
            numberValue(
                item.rate
            );


        // ==================================================
        // AMOUNT
        // ==================================================

        const amount =
            numberValue(
                item.amount
            );


        // ==================================================
        // CREATE ROW
        // ==================================================

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


        sno++;

    }
);


// ============================================================
// OTHER CHARGES
// ============================================================

function loadOtherCharges(
    bill,
    othersData
) {

    if (
        !chargeTable
    ) {

        console.error(
            "chargeTable element not found."
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
                ${sno}
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


        sno++;

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
                ${sno}
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


        sno++;

    }


    // ========================================================
    // ADDITIONAL CHARGES
    // ========================================================

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


                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";


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
                        ${sno}
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


                sno++;

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


// ============================================================
// CFT SUMMARY
// ============================================================
//
// SAME WOOD + SAME QUALITY
// ========================
//
// Example:
//
// Teak (1) = 3.06 CFT
// Teak (2) = 8.00 + 3.65
//
// Display:
//
// 1. Teak (1)       3.06 CFT
// 2. Teak (2)      11.65 CFT
//
// ============================================================

function loadCftSummary(
    woodData
) {

    if (
        !cftSummary
    ) {

        console.error(
            "cftSummary element not found."
        );

        return;

    }


    cftSummary.innerHTML = "";


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


    // ========================================================
    // GROUP BY WOOD + QUALITY
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
                "";


            if (
                woodName === "Other"
            ) {

                woodName =
                    item.otherWood ||
                    item.woodName ||
                    "Other";

            }


            if (
                !woodName
            ) {

                woodName = "-";

            }


            const quality =
                item.quality !== undefined &&
                item.quality !== ""
                    ? String(
                        item.quality
                    )
                    : "-";


            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            const key =
                `${woodName}|||${quality}`;


            if (
                !grouped.has(
                    key
                )
            ) {

                grouped.set(
                    key,
                    {

                        woodName:
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
            ).cft +=
                cubicFeet;

        }
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    const groups =
        Array.from(
            grouped.values()
        );


    groups.forEach(
        function (
            group,
            index
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cft-summary-row";


            row.innerHTML = `

                <span
                    class="cft-name">

                    <b>

                        ${index + 1}.
                        ${escapeHTML(
                            group.woodName
                        )}
                        (${escapeHTML(
                            group.quality
                        )})

                    </b>

                </span>


                <span
                    class="cft-value">

                    ${group.cft.toFixed(2)}
                    CFT

                </span>

            `;


            cftSummary.appendChild(
                row
            );

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

            const confirmClear =
                confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (
                !confirmClear
            ) {

                return;

            }


            // =================================================
            // BILL
            // =================================================

            localStorage.removeItem(
                "current_bill_data"
            );


            localStorage.removeItem(
                "savedBillId"
            );


            localStorage.removeItem(
                "savedBillNo"
            );


            // =================================================
            // CUSTOMER
            // =================================================

            localStorage.removeItem(
                "customerName"
            );


            localStorage.removeItem(
                "customerMobile"
            );


            localStorage.removeItem(
                "customerPlace"
            );


            localStorage.removeItem(
                "savedCustomerId"
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


            // =================================================
            // OTHER CHARGES
            // =================================================

            localStorage.removeItem(
                "otherCharge"
            );


            localStorage.removeItem(
                "othersData"
            );


            // =================================================
            // DISCOUNT
            // =================================================

            localStorage.removeItem(
                "discount"
            );


            localStorage.removeItem(
                "discountAmount"
            );


            localStorage.removeItem(
                "discountApplied"
            );


            // =================================================
            // ADVANCE
            // =================================================

            localStorage.removeItem(
                "advance"
            );


            localStorage.removeItem(
                "advanceAmount"
            );


            localStorage.removeItem(
                "balanceAmount"
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


            console.log(
                "ALL BILL DATA CLEARED"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// WHATSAPP
// ============================================================
//
// Same purpose:
// 1. Take customer name from displayed DB data.
// 2. Take mobile from displayed DB data.
// 3. Generate PDF.
// 4. Send PDF + customer information to backend.
// 5. Backend sends WhatsApp message.
//
// No WhatsApp-number validation is performed here.
// ============================================================

function getCustomerNameForWhatsApp() {

    return (
        customerNameElement?.textContent ||
        ""
    ).trim();

}


function getCustomerMobileForWhatsApp() {

    return (
        customerMobileElement?.textContent ||
        ""
    )
        .trim()
        .replace(
            /\D/g,
            ""
        );

}


function getBillNoForWhatsApp() {

    return (
        billNoElement?.textContent ||
        ""
    ).trim();

}


function getCustomerGreeting(
    name
) {

    const cleanName =
        String(
            name || ""
        ).trim();


    if (
        !cleanName
    ) {

        return "Dear Customer";

    }


    return (
        "Dear " +
        cleanName
    );

}


// ============================================================
// GENERATE PDF BASE64
// ============================================================

async function generateBillPDFBase64() {

    const billContainer =
        document.querySelector(
            ".bill-container"
        );


    if (
        !billContainer
    ) {

        throw new Error(
            "Bill container not found."
        );

    }


    // ========================================================
    // HTML2CANVAS
    // ========================================================

    if (
        typeof html2canvas !==
        "function"
    ) {

        throw new Error(
            "html2canvas is not loaded."
        );

    }


    // ========================================================
    // JSPDF
    // ========================================================

    if (
        typeof jspdf ===
        "undefined"
    ) {

        throw new Error(
            "jsPDF is not loaded."
        );

    }


    console.log(
        "GENERATING BILL PDF..."
    );


    const canvas =
        await html2canvas(
            billContainer,
            {

                scale: 2,

                useCORS: true,

                allowTaint: true,

                backgroundColor:
                    "#ffffff"

            }
        );


    const imgData =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );


    const {
        jsPDF
    } =
        jspdf;


    const pdf =
        new jsPDF(
            {

                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4"

            }
        );


    const pageWidth =
        pdf.internal
            .pageSize
            .getWidth();


    const pageHeight =
        pdf.internal
            .pageSize
            .getHeight();


    const imgWidth =
        pageWidth;


    const imgHeight =
        (
            canvas.height *
            imgWidth
        ) /
        canvas.width;


    let heightLeft =
        imgHeight;


    let position = 0;


    pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight
    );


    heightLeft -=
        pageHeight;


    while (
        heightLeft > 0
    ) {

        position -=
            pageHeight;


        pdf.addPage();


        pdf.addImage(
            imgData,
            "JPEG",
            0,
            position,
            imgWidth,
            imgHeight
        );


        heightLeft -=
            pageHeight;

    }


    const pdfDataUri =
        pdf.output(
            "datauristring"
        );


    const pdfBase64 =
        pdfDataUri.split(
            ","
        )[1] || "";


    if (
        !pdfBase64
    ) {

        throw new Error(
            "PDF Base64 generation failed."
        );

    }


    console.log(
        "PDF BASE64 READY"
    );


    return pdfBase64;

}


// ============================================================
// SEND WHATSAPP
// ============================================================

async function sendBillThroughWhatsApp() {

    if (
        !whatsappBtn
    ) {

        console.error(
            "whatsappBtn not found."
        );

        return;

    }


    const customerName =
        getCustomerNameForWhatsApp();


    const customerMobile =
        getCustomerMobileForWhatsApp();


    const billNo =
        getBillNoForWhatsApp();


    console.log(
        "WHATSAPP CUSTOMER:",
        customerName
    );


    console.log(
        "WHATSAPP MOBILE:",
        customerMobile
    );


    console.log(
        "WHATSAPP BILL NO:",
        billNo
    );


    // ========================================================
    // CUSTOMER NAME
    // ========================================================

    if (
        !customerName ||
        customerName === "-"
    ) {

        alert(
            "Customer name is missing."
        );

        return;

    }


    // ========================================================
    // MOBILE
    // ========================================================

    if (
        !customerMobile ||
        customerMobile.length < 10
    ) {

        alert(
            "Customer mobile number is missing or invalid."
        );

        return;

    }


    const oldText =
        whatsappBtn.textContent;


    whatsappBtn.disabled =
        true;


    whatsappBtn.textContent =
        "Sending...";


    try {

        // ====================================================
        // PDF
        // ====================================================

        const pdfBase64 =
            await generateBillPDFBase64();


        console.log(
            "PDF GENERATED"
        );


        // ====================================================
        // MESSAGE
        // ====================================================

        const message =
            `${getCustomerGreeting(
                customerName
            )},\n\n` +

            `Please find your bill attached.\n\n` +

            `Thank you for shopping with us. ` +

            `We look forward to serving you again.\n\n` +

            `— Amman Saw Mill`;


        // ====================================================
        // FILE NAME
        // ====================================================

        const safeCustomerName =
            customerName
                .replace(
                    /[^a-z0-9]/gi,
                    "_"
                );


        const pdfFileName =
            `${safeCustomerName}_bill.pdf`;


        // ====================================================
        // PAYLOAD
        // ====================================================

        const payload = {

            customer_name:
                customerName,

            customer_mobile:
                customerMobile,

            bill_no:
                billNo,

            message:
                message,

            pdf_base64:
                pdfBase64,

            filename:
                pdfFileName

        };


        console.log(
            "SENDING BILL TO BACKEND..."
        );


        console.log(
            "WHATSAPP PAYLOAD:",
            {

                customer_name:
                    customerName,

                customer_mobile:
                    customerMobile,

                bill_no:
                    billNo,

                pdf_ready:
                    !!pdfBase64

            }
        );


        // ====================================================
        // API
        // ====================================================

        const response =
            await fetch(
                `${API_URL}/whatsapp/send-bill`,
                {

                    method:
                        "POST",

                    headers:
                        {

                            "Content-Type":
                                "application/json"

                        },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        console.log(
            "BACKEND STATUS:",
            response.status
        );


        const result =
            await response
                .json()
                .catch(
                    function () {

                        return {};

                    }
                );


        console.log(
            "BACKEND RESULT:",
            result
        );


        // ====================================================
        // ERROR
        // ====================================================

        if (
            !response.ok ||
            result.success === false
        ) {

            throw new Error(

                result.message ||

                result.error ||

                `WhatsApp API failed (${response.status})`

            );

        }


        // ====================================================
        // SUCCESS
        // ====================================================

        alert(
            "Bill sent successfully through WhatsApp."
        );


    }
    catch (
        error
    ) {

        console.error(
            "WHATSAPP SEND ERROR:",
            error
        );


        alert(

            "Unable to send the bill through WhatsApp.\n\n" +

            error.message

        );

    }
    finally {

        whatsappBtn.disabled =
            false;


        whatsappBtn.textContent =
            oldText;

    }

}


// ============================================================
// WHATSAPP BUTTON EVENT
// ============================================================

if (
    whatsappBtn
) {

    whatsappBtn.addEventListener(
        "click",
        sendBillThroughWhatsApp
    );

}


// ============================================================
// START
// ============================================================

console.log(
    "Calling loadFinalBill()..."
);


loadFinalBill();
}
