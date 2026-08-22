// ============================================================
// BILL.JS
// FINAL DEBUG VERSION
// ============================================================

console.log("========================================");
console.log("BILL.JS LOADED");
console.log("========================================");


// ============================================================
// NUMBER HELPER
// ============================================================

function getNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = parseFloat(
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

    return "₹ " + Math.round(
        getNumber(value)
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
// READ JSON STORAGE
// ============================================================

function readJSON(key) {

    const value =
        localStorage.getItem(key);

    if (!value) {

        return null;

    }

    try {

        return JSON.parse(value);

    }
    catch (error) {

        console.warn(
            "Invalid JSON:",
            key,
            error
        );

        return null;

    }

}


// ============================================================
// CENTRAL BILL
// ============================================================

let centralBill = {};

try {

    if (
        typeof getBillData ===
        "function"
    ) {

        centralBill =
            getBillData() || {};

    }
    else {

        centralBill =
            readJSON(
                "current_bill_data"
            ) || {};

    }

}
catch (error) {

    console.error(
        "CENTRAL BILL ERROR:",
        error
    );

    centralBill = {};

}


console.log(
    "CENTRAL BILL:",
    centralBill
);


// ============================================================
// BILL NUMBER
// ============================================================

const billNoElement =
    document.getElementById(
        "billNo"
    );

if (billNoElement) {

    billNoElement.textContent =
        "---";

}


// ============================================================
// DATE
// ============================================================

const billDate =
    document.getElementById(
        "billDate"
    );

const billDayTime =
    document.getElementById(
        "billDayTime"
    );


const days = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


let savedDate =
    localStorage.getItem(
        "billDate"
    );


if (!savedDate) {

    const today =
        new Date();

    savedDate =
        today
            .getDate()
            .toString()
            .padStart(2, "0")
        + "/"
        +
        (today.getMonth() + 1)
            .toString()
            .padStart(2, "0")
        + "/"
        +
        today.getFullYear();

    localStorage.setItem(
        "billDate",
        savedDate
    );

}


const now =
    new Date();


const time =
    now.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );


if (billDate) {

    billDate.textContent =
        savedDate;

}


if (billDayTime) {

    billDayTime.textContent =
        days[now.getDay()]
        + " | "
        + time;

}


// ============================================================
// CUSTOMER
// ============================================================

const personal =
    centralBill.personal || {};


const customerNameValue =
    personal.customerName ||
    localStorage.getItem(
        "customerName"
    ) ||
    "-";


const customerMobileValue =
    personal.customerMobile ||
    personal.mobileNumber ||
    localStorage.getItem(
        "customerMobile"
    ) ||
    "-";


const customerPlaceValue =
    personal.customerPlace ||
    personal.place ||
    localStorage.getItem(
        "customerPlace"
    ) ||
    "-";


const customerName =
    document.getElementById(
        "customerName"
    );


const customerMobile =
    document.getElementById(
        "customerMobile"
    );


const customerPlace =
    document.getElementById(
        "customerPlace"
    );


if (customerName) {

    customerName.textContent =
        customerNameValue;

}


if (customerMobile) {

    customerMobile.textContent =
        customerMobileValue;

}


if (customerPlace) {

    customerPlace.textContent =
        customerPlaceValue;

}


// ============================================================
// WOOD DATA
// ============================================================

let woodData = [];


const storedWood =
    readJSON(
        "woodData"
    );


if (
    Array.isArray(
        centralBill.wood
    )
) {

    woodData =
        centralBill.wood;

}
else if (
    Array.isArray(
        storedWood
    )
) {

    woodData =
        storedWood;

}


console.log(
    "WOOD DATA:",
    woodData
);


// ============================================================
// WOOD TABLE
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


let woodSno = 1;


if (woodTable) {

    woodTable.innerHTML = "";


    if (
        woodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    No wood details found
                </td>

            </tr>

        `;

    }


    woodData.forEach(
        function (item) {

            let woodName =
                item.woodType ||
                "-";


            if (
                woodName === "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            const breadth =
                item.breadth || "-";


            const thickness =
                item.thickness || "-";


            const size =
                breadth +
                " × " +
                thickness;


            const quality =
                String(
                    item.quality ??
                    "1"
                );


            const rate =
                getNumber(
                    item.rate
                );


            const amount =
                getNumber(
                    item.amount
                );


            // =============================================
            // NO PIECES
            // =============================================

            if (
                !Array.isArray(
                    item.pieces
                ) ||
                item.pieces.length === 0
            ) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${woodSno}
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

                    <td>-</td>

                    <td>-</td>

                    <td>
                        ${Math.round(
                            getNumber(
                                item.totalLength
                            )
                        )}
                    </td>

                    <td>
                        ${getNumber(
                            item.cubicFeet
                        ).toFixed(2)}
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


                woodSno++;

                return;

            }


            // =============================================
            // PIECES
            // =============================================

            item.pieces.forEach(
                function (
                    piece,
                    index
                ) {

                    const length =
                        getNumber(
                            piece.length
                        );


                    const extraLength =
                        getNumber(
                            piece.extraLength
                        );


                    const qty =
                        getNumber(
                            piece.qty
                        );


                    const totalLength =
                        getNumber(
                            piece.totalLength
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    if (
                        index === 0
                    ) {

                        row.innerHTML = `

                            <td>
                                ${woodSno}
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
                                ${length + extraLength}
                            </td>

                            <td>
                                ${qty}
                            </td>

                            <td>
                                ${Math.round(
                                    totalLength
                                )}
                            </td>

                            <td>
                                ${getNumber(
                                    item.cubicFeet
                                ).toFixed(2)}
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

                    }
                    else {

                        row.innerHTML = `

                            <td></td>

                            <td></td>

                            <td></td>

                            <td>
                                ${length + extraLength}
                            </td>

                            <td>
                                ${qty}
                            </td>

                            <td>
                                ${Math.round(
                                    totalLength
                                )}
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


            woodSno++;

        }
    );

}


// ============================================================
// LABOUR DATA
// ============================================================
//
// IMPORTANT:
// Support BOTH:
//
// current_bill_data.labour
//
// AND:
//
// localStorage.labourCharge
// localStorage.otherCharge
// localStorage.othersData
// localStorage.otherItems
//
// ============================================================

const labour =
    centralBill.labour || {};


console.log(
    "LABOUR OBJECT:",
    labour
);


// ============================================================
// LABOUR CHARGE
// ============================================================

let labourCharge = 0;


const labourCandidates = [

    labour.labourCharge,

    labour.LabourCharge,

    labour.labour,

    labour.labourAmount,

    centralBill.labourCharge,

    localStorage.getItem(
        "labourCharge"
    ),

    localStorage.getItem(
        "LabourCharge"
    ),

    localStorage.getItem(
        "labourAmount"
    )

];


for (
    let i = 0;
    i < labourCandidates.length;
    i++
) {

    const value =
        getNumber(
            labourCandidates[i]
        );


    if (
        value > 0
    ) {

        labourCharge =
            value;

        break;

    }

}


// ============================================================
// OTHER CHARGE
// ============================================================

let otherCharge = 0;


const otherChargeCandidates = [

    labour.otherCharge,

    labour.OtherCharge,

    labour.otherAmount,

    labour.other,

    centralBill.otherCharge,

    localStorage.getItem(
        "otherCharge"
    ),

    localStorage.getItem(
        "OtherCharge"
    ),

    localStorage.getItem(
        "otherAmount"
    )

];


for (
    let i = 0;
    i < otherChargeCandidates.length;
    i++
) {

    const value =
        getNumber(
            otherChargeCandidates[i]
        );


    if (
        value > 0
    ) {

        otherCharge =
            value;

        break;

    }

}


// ============================================================
// ADDITIONAL OTHER ITEMS
// ============================================================

let otherItems = [];


const possibleItems = [

    labour.othersData,

    labour.otherItems,

    labour.items,

    labour.additionalCharges,

    centralBill.othersData,

    centralBill.otherItems,

    readJSON("othersData"),

    readJSON("otherItems")

];


for (
    let i = 0;
    i < possibleItems.length;
    i++
) {

    if (
        Array.isArray(
            possibleItems[i]
        )
    ) {

        otherItems =
            possibleItems[i];

        break;

    }

}


console.log(
    "LABOUR CHARGE FOUND:",
    labourCharge
);


console.log(
    "OTHER CHARGE FOUND:",
    otherCharge
);


console.log(
    "OTHER ITEMS FOUND:",
    otherItems
);


// ============================================================
// CALCULATE ADDITIONAL TOTAL
// ============================================================

let additionalTotal = 0;


otherItems.forEach(
    function (item) {

        if (!item) {
            return;
        }


        additionalTotal +=
            getNumber(
                item.amount
            );

    }
);


// ============================================================
// FINAL OTHERS TOTAL
// ============================================================
//
// Labour + Other + Additional
//
// Example:
//
// 100 + 11 + 20
//
// = 131
//
// ============================================================

const othersTotal =
    Math.round(
        labourCharge +
        otherCharge +
        additionalTotal
    );


console.log(
    "----------------------------------------"
);

console.log(
    "LABOUR:",
    labourCharge
);

console.log(
    "OTHER:",
    otherCharge
);

console.log(
    "ADDITIONAL:",
    additionalTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);

console.log(
    "----------------------------------------"
);


// ============================================================
// CHARGE TABLE
// ============================================================

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


if (chargeTable) {

    chargeTable.innerHTML = "";


    let chargeSno = 1;


    // =============================================
    // LABOUR
    // =============================================

    if (
        labourCharge > 0
    ) {

        chargeTable.innerHTML += `

            <tr>

                <td>
                    ${chargeSno++}
                </td>

                <td>
                    Labour Charge
                </td>

                <td>
                    ${money(
                        labourCharge
                    )}
                </td>

            </tr>

        `;

    }


    // =============================================
    // OTHER CHARGE
    // =============================================

    if (
        otherCharge > 0
    ) {

        chargeTable.innerHTML += `

            <tr>

                <td>
                    ${chargeSno++}
                </td>

                <td>
                    Other Charge
                </td>

                <td>
                    ${money(
                        otherCharge
                    )}
                </td>

            </tr>

        `;

    }


    // =============================================
    // ADDITIONAL
    // =============================================

    otherItems.forEach(
        function (item) {

            if (!item) {
                return;
            }


            const amount =
                getNumber(
                    item.amount
                );


            if (
                amount <= 0
            ) {

                return;

            }


            chargeTable.innerHTML += `

                <tr>

                    <td>
                        ${chargeSno++}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.name ||
                            "Other"
                        )}
                    </td>

                    <td>
                        ${money(
                            amount
                        )}
                    </td>

                </tr>

            `;

        }
    );


    // =============================================
    // NOTHING
    // =============================================

    if (
        chargeSno === 1
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
// WOOD TOTAL
// ============================================================

let woodTotal = 0;


const woodTotalCandidates = [

    centralBill.totals?.woodTotal,

    centralBill.wood?.woodTotal,

    localStorage.getItem(
        "woodTotal"
    ),

    localStorage.getItem(
        "finalWoodTotal"
    )

];


for (
    let i = 0;
    i < woodTotalCandidates.length;
    i++
) {

    const value =
        getNumber(
            woodTotalCandidates[i]
        );


    if (
        value > 0
    ) {

        woodTotal =
            value;

        break;

    }

}


// ============================================================
// SUBTOTAL
// ============================================================

const subtotal =
    Math.round(
        woodTotal +
        othersTotal
    );


console.log(
    "WOOD TOTAL:",
    woodTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);

console.log(
    "SUBTOTAL:",
    subtotal
);


// ============================================================
// DISCOUNT
// ============================================================

const discount =
    Math.min(
        subtotal,
        Math.max(
            0,
            getNumber(
                centralBill.discount?.discountAmount
            ) ||
            getNumber(
                localStorage.getItem(
                    "discountAmount"
                )
            ) ||
            getNumber(
                localStorage.getItem(
                    "discount"
                )
            ) ||
            getNumber(
                localStorage.getItem(
                    "billDiscount"
                )
            )
        )
    );


console.log(
    "DISCOUNT:",
    discount
);


// ============================================================
// GRAND TOTAL
// ============================================================
//
// DO NOT USE OLD finalTotal.
//
// Always calculate:
//
// Wood + Others - Discount
//
// ============================================================

const grandTotal =
    Math.max(
        0,
        Math.round(
            subtotal -
            discount
        )
    );


console.log(
    "GRAND TOTAL:",
    grandTotal
);


// ============================================================
// DISPLAY TOTALS
// ============================================================

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );


if (woodTotalElement) {

    woodTotalElement.textContent =
        money(
            woodTotal
        );

}


const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );


if (othersTotalElement) {

    othersTotalElement.textContent =
        money(
            othersTotal
        );

}


const subtotalElement =
    document.getElementById(
        "subtotal"
    );


if (subtotalElement) {

    subtotalElement.textContent =
        money(
            subtotal
        );

}


const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );


if (grandTotalElement) {

    grandTotalElement.textContent =
        money(
            grandTotal
        );

}


// ============================================================
// DISCOUNT DISPLAY
// ============================================================

const discountRow =
    document.getElementById(
        "discountRow"
    );


const discountElement =
    document.getElementById(
        "discountAmount"
    );


if (
    discount > 0
) {

    if (discountRow) {

        discountRow.style.display =
            "flex";

    }


    if (discountElement) {

        discountElement.textContent =
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


// ============================================================
// ADVANCE
// ============================================================

let advanceAmount = 0;


const advanceCandidates = [

    centralBill.advance?.advanceAmount,

    centralBill.advance?.amount,

    localStorage.getItem(
        "advanceAmount"
    ),

    localStorage.getItem(
        "advance"
    ),

    localStorage.getItem(
        "advanceValue"
    )

];


for (
    let i = 0;
    i < advanceCandidates.length;
    i++
) {

    const value =
        getNumber(
            advanceCandidates[i]
        );


    if (
        value > 0
    ) {

        advanceAmount =
            value;

        break;

    }

}


// Advance cannot exceed grand total

if (
    advanceAmount >
    grandTotal
) {

    advanceAmount =
        grandTotal;

}


// ============================================================
// BALANCE
// ============================================================

const balanceAmount =
    Math.max(
        0,
        Math.round(
            grandTotal -
            advanceAmount
        )
    );


console.log(
    "ADVANCE:",
    advanceAmount
);

console.log(
    "BALANCE:",
    balanceAmount
);


// ============================================================
// ADVANCE DISPLAY
// ============================================================

const advanceRow =
    document.getElementById(
        "advanceRow"
    );


const advanceElement =
    document.getElementById(
        "advanceAmount"
    );


if (
    advanceAmount > 0
) {

    if (advanceRow) {

        advanceRow.style.display =
            "flex";

    }


    if (advanceElement) {

        advanceElement.textContent =
            money(
                advanceAmount
            );

    }

}
else {

    if (advanceRow) {

        advanceRow.style.display =
            "none";

    }

}


// ============================================================
// BALANCE DISPLAY
// ============================================================

const balanceElement =
    document.getElementById(
        "balanceAmount"
    );


if (balanceElement) {

    balanceElement.textContent =
        money(
            balanceAmount
        );

}


// ============================================================
// SAVE CURRENT TOTALS
// ============================================================
//
// This does NOT clear anything.
// Refresh will keep the data.
//
// ============================================================

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
    "othersTotal",
    String(
        othersTotal
    )
);


localStorage.setItem(
    "balanceAmount",
    String(
        balanceAmount
    )
);


// ============================================================
// CFT SUMMARY
// ============================================================

const cftSummary = {};


woodData.forEach(
    function (item) {

        let woodName =
            item.woodType ||
            "Unknown";


        if (
            woodName === "Other"
        ) {

            woodName =
                item.otherWood ||
                "Other";

        }


        const quality =
            String(
                item.quality ??
                "1"
            );


        const cft =
            getNumber(
                item.cubicFeet
            );


        const key =
            woodName
                .trim()
                .toLowerCase()
            +
            "||"
            +
            quality;


        if (
            !cftSummary[key]
        ) {

            cftSummary[key] = {

                wood:
                    woodName,

                quality:
                    quality,

                cft:
                    0

            };

        }


        cftSummary[key].cft +=
            cft;

    }
);


// ============================================================
// DISPLAY CFT
// ============================================================

const cftDiv =
    document.getElementById(
        "cftSummary"
    );


if (cftDiv) {

    cftDiv.innerHTML = "";


    const groups =
        Object.values(
            cftSummary
        );


    if (
        groups.length === 0
    ) {

        cftDiv.innerHTML = `

            <p>

                <b>-</b>

                <span>
                    0.00 CFT
                </span>

            </p>

        `;

    }


    groups.forEach(
        function (group) {

            cftDiv.innerHTML += `

                <p>

                    <b>
                        ${escapeHTML(
                            group.wood
                        )}
                        (${escapeHTML(
                            group.quality
                        )})
                    </b>

                    <span>
                        ${group.cft.toFixed(2)}
                        CFT
                    </span>

                </p>

            `;

        }
    );

}


// ============================================================
// EDIT
// ============================================================

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "editingBill",
                "true"
            );


            window.location.href =
                "wood.html";

        }
    );

}


// ============================================================
// PRINT
// ============================================================

const printBtn =
    document.getElementById(
        "printBtn"
    );


if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// ============================================================
// BACK
// ============================================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}


// ============================================================
// CONFIRM
// ============================================================

const confirmBillBtn =
    document.getElementById(
        "confirmBill"
    );


if (confirmBillBtn) {

    confirmBillBtn.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Are you sure you want to confirm this bill?"
                );


            if (!confirmed) {

                return;

            }


            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            localStorage.setItem(
                "finalTotal",
                String(
                    grandTotal
                )
            );


            localStorage.setItem(
                "advanceAmount",
                String(
                    advanceAmount
                )
            );


            localStorage.setItem(
                "balanceAmount",
                String(
                    balanceAmount
                )
            );


            localStorage.setItem(
                "billDiscount",
                String(
                    discount
                )
            );


            window.location.href =
                "../html/confirm.html";

        }
    );

}


// ============================================================
// CLEAR
// ============================================================

const clearBtn =
    document.getElementById(
        "clearBtn"
    );


if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                window.confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (!confirmClear) {

                return;

            }


            if (
                typeof clearBillData ===
                "function"
            ) {

                clearBillData();

            }
            else {

                localStorage.clear();

                sessionStorage.clear();

            }


            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// FINAL CONSOLE
// ============================================================

console.log("========================================");
console.log("FINAL BILL CALCULATION");
console.log("========================================");

console.log(
    "Wood Total     :",
    woodTotal
);

console.log(
    "Labour Charge  :",
    labourCharge
);

console.log(
    "Other Charge   :",
    otherCharge
);

console.log(
    "Additional     :",
    additionalTotal
);

console.log(
    "Others Total   :",
    othersTotal
);

console.log(
    "Subtotal       :",
    subtotal
);

console.log(
    "Discount       :",
    discount
);

console.log(
    "Grand Total    :",
    grandTotal
);

console.log(
    "Advance Amount :",
    advanceAmount
);

console.log(
    "Balance Amount :",
    balanceAmount
);

console.log("========================================");
console.log("BILL.JS READY");
console.log("========================================");
