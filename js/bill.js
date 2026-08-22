// =========================================
// BILL.JS
// WOOD BILL / QUOTATION PAGE
// UPDATED VERSION
// =========================================

console.log("=========================================");
console.log("BILL.JS LOADED");
console.log("=========================================");


// ============================================================
// HELPERS
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
// INTEGER MONEY
// ============================================================

function money(value) {

    return "₹ " +
        Math.round(
            getNumber(value)
        );
}


// ============================================================
// ESCAPE HTML
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
// BILL NUMBER
// ============================================================

const billNoElement =
    document.getElementById("billNo");

if (billNoElement) {

    billNoElement.textContent = "---";

}


// ============================================================
// BILL DATE
// ============================================================

const billDate =
    document.getElementById("billDate");

const billDayTime =
    document.getElementById("billDayTime");


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
    localStorage.getItem("billDate");


if (!savedDate) {

    const today =
        new Date();

    savedDate =
        today.getDate()
            .toString()
            .padStart(2, "0")
        + "/" +
        (today.getMonth() + 1)
            .toString()
            .padStart(2, "0")
        + "/" +
        today.getFullYear();

    localStorage.setItem(
        "billDate",
        savedDate
    );

}


const currentDate =
    new Date();


const time =
    currentDate.toLocaleTimeString(
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
        days[currentDate.getDay()] +
        " | " +
        time;

}


// ============================================================
// CENTRAL BILL DATA
// ============================================================

let centralBill = {};

if (
    typeof getBillData ===
    "function"
) {

    try {

        centralBill =
            getBillData() || {};

        console.log(
            "CENTRAL BILL DATA:",
            centralBill
        );

    }
    catch (error) {

        console.error(
            "Unable to read central bill data:",
            error
        );

    }

}


// ============================================================
// CUSTOMER DETAILS
// ============================================================

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


const personalData =
    centralBill.personal || {};


const savedCustomerName =
    personalData.customerName ||
    localStorage.getItem("customerName") ||
    "-";


const savedCustomerMobile =
    personalData.customerMobile ||
    personalData.mobileNumber ||
    localStorage.getItem("customerMobile") ||
    localStorage.getItem("mobileNumber") ||
    "-";


const savedCustomerPlace =
    personalData.customerPlace ||
    personalData.place ||
    localStorage.getItem("customerPlace") ||
    localStorage.getItem("place") ||
    "-";


if (customerName) {

    customerName.textContent =
        savedCustomerName;

}


if (customerMobile) {

    customerMobile.textContent =
        savedCustomerMobile;

}


if (customerPlace) {

    customerPlace.textContent =
        savedCustomerPlace;

}


// ============================================================
// LOAD WOOD DATA
// ============================================================

let woodData = [];


try {

    const centralWood =
        centralBill.wood;


    if (
        Array.isArray(centralWood)
    ) {

        woodData =
            centralWood;

    }
    else {

        woodData =
            JSON.parse(
                localStorage.getItem(
                    "woodData"
                )
            ) || [];

    }

}
catch (error) {

    console.error(
        "Unable to read woodData:",
        error
    );

    woodData = [];

}


if (
    !Array.isArray(woodData)
) {

    woodData = [];

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


let sno = 1;


if (woodTable) {

    woodTable.innerHTML = "";


    if (
        woodData.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `
            <td colspan="10">
                No wood details found
            </td>
        `;


        woodTable.appendChild(
            row
        );

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
                item.breadth ||
                "-";


            const thickness =
                item.thickness ||
                "-";


            const size =
                breadth +
                " × " +
                thickness;


            const quality =
                String(
                    item.quality ??
                    "1"
                ).trim();


            const rate =
                getNumber(
                    item.rate
                );


            const amount =
                getNumber(
                    item.amount
                );


            // =========================================
            // NO PIECES
            // =========================================

            if (
                !Array.isArray(item.pieces) ||
                item.pieces.length === 0
            ) {

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


                sno++;

                return;

            }


            // =========================================
            // PIECES
            // =========================================

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


                    const lengthText =
                        length +
                        extraLength;


                    const pieceQty =
                        getNumber(
                            piece.qty
                        );


                    const pieceTotalLength =
                        getNumber(
                            piece.totalLength
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    // =====================================
                    // FIRST PIECE
                    // =====================================

                    if (
                        index === 0
                    ) {

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
                                ${pieceQty}
                            </td>

                            <td>
                                ${Math.round(
                                    pieceTotalLength
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

                    // =====================================
                    // ADDITIONAL PIECES
                    // =====================================

                    else {

                        row.innerHTML = `

                            <td></td>

                            <td></td>

                            <td></td>

                            <td>
                                ${lengthText}
                            </td>

                            <td>
                                ${pieceQty}
                            </td>

                            <td>
                                ${Math.round(
                                    pieceTotalLength
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


            sno++;

        }
    );

}


// ============================================================
// LOAD LABOUR DATA
// ============================================================

const labourData =
    centralBill.labour || {};


let labourCharge =
    getNumber(
        labourData.labourCharge
    );


if (
    labourCharge === 0
) {

    labourCharge =
        getNumber(
            localStorage.getItem(
                "labourCharge"
            )
        );

}


// ============================================================
// OTHER CHARGE
// ============================================================

let otherCharge =
    getNumber(
        labourData.otherCharge
    );


if (
    otherCharge === 0
) {

    otherCharge =
        getNumber(
            localStorage.getItem(
                "otherCharge"
            )
        );

}


// ============================================================
// ADDITIONAL OTHER CHARGES
// ============================================================

let othersData = [];


if (
    Array.isArray(
        labourData.othersData
    )
) {

    othersData =
        labourData.othersData;

}


if (
    othersData.length === 0
) {

    try {

        othersData =
            JSON.parse(
                localStorage.getItem(
                    "othersData"
                )
            ) || [];

    }
    catch (error) {

        console.error(
            "Unable to read othersData:",
            error
        );

        othersData = [];

    }

}


if (
    !Array.isArray(othersData)
) {

    othersData = [];

}


console.log(
    "LABOUR CHARGE:",
    labourCharge
);

console.log(
    "OTHER CHARGE:",
    otherCharge
);

console.log(
    "ADDITIONAL CHARGES:",
    othersData
);


// ============================================================
// CHARGE TABLE
// ============================================================

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


let chargeSno = 1;


if (chargeTable) {

    chargeTable.innerHTML = "";

    let hasCharge = false;


    // ========================================================
    // LABOUR CHARGE
    // ========================================================

    if (
        labourCharge > 0
    ) {

        hasCharge = true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

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

        `;


        chargeTable.appendChild(
            row
        );

    }


    // ========================================================
    // OTHER CHARGE
    // ========================================================

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

        `;


        chargeTable.appendChild(
            row
        );

    }


    // ========================================================
    // ADDITIONAL CHARGES
    // ========================================================

    othersData.forEach(
        function (item) {

            if (!item) {
                return;
            }


            const amount =
                getNumber(
                    item.amount
                );


            const name =
                item.name ||
                "Other";


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
                    ${chargeSno++}
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


    // ========================================================
    // NO CHARGES
    // ========================================================

    if (
        !hasCharge
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>-</td>
            <td>-</td>
            <td>-</td>

        `;


        chargeTable.appendChild(
            row
        );

    }

}


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal =
    getNumber(
        centralBill.totals?.woodTotal
    );


if (
    woodTotal === 0
) {

    woodTotal =
        getNumber(
            localStorage.getItem(
                "woodTotal"
            )
        );

}


// ============================================================
// CALCULATE OTHERS TOTAL
// ============================================================
//
// IMPORTANT:
// DO NOT DEPEND ONLY ON localStorage "othersTotal".
//
// Calculate:
//
// Labour + Other + Additional Charges
//
// Example:
// 100 + 11 + 20 = 131
//
// ============================================================

let additionalOthersTotal = 0;


othersData.forEach(
    function (item) {

        if (!item) {
            return;
        }


        additionalOthersTotal +=
            getNumber(
                item.amount
            );

    }
);


const calculatedOthersTotal =
    labourCharge +
    otherCharge +
    additionalOthersTotal;


let othersTotal =
    calculatedOthersTotal;


// Only use saved value if there is absolutely
// no detailed charge information.

if (
    calculatedOthersTotal === 0
) {

    othersTotal =
        getNumber(
            centralBill.totals?.othersTotal
        );

}


if (
    othersTotal === 0
) {

    othersTotal =
        getNumber(
            localStorage.getItem(
                "othersTotal"
            )
        );

}


// ============================================================
// SAVE CORRECT OTHERS TOTAL
// ============================================================

localStorage.setItem(
    "othersTotal",
    String(
        Math.round(
            othersTotal
        )
    )
);


console.log(
    "========================================="
);

console.log(
    "OTHERS TOTAL CALCULATION"
);

console.log(
    "Labour:",
    labourCharge
);

console.log(
    "Other:",
    otherCharge
);

console.log(
    "Additional:",
    additionalOthersTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);

console.log(
    "========================================="
);


// ============================================================
// SUBTOTAL
// ============================================================

const subtotal =
    woodTotal +
    othersTotal;


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


// ============================================================
// WOOD TOTAL DISPLAY
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


// ============================================================
// OTHERS TOTAL DISPLAY
// ============================================================

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


// ============================================================
// DISCOUNT
// ============================================================

const discountData =
    centralBill.discount || {};


let discount =
    getNumber(
        discountData.discountAmount
    );


if (
    discount === 0
) {

    discount =
        getNumber(
            localStorage.getItem(
                "discountAmount"
            )
        );

}


if (
    discount === 0
) {

    discount =
        getNumber(
            localStorage.getItem(
                "discount"
            )
        );

}


if (
    discount === 0
) {

    discount =
        getNumber(
            localStorage.getItem(
                "discountValue"
            )
        );

}


if (
    discount === 0
) {

    discount =
        getNumber(
            localStorage.getItem(
                "billDiscount"
            )
        );

}


if (
    discount < 0
) {

    discount = 0;

}


if (
    discount > subtotal
) {

    discount =
        subtotal;

}


// ============================================================
// GRAND TOTAL
// ============================================================
//
// IMPORTANT:
//
// Always calculate from CURRENT values.
//
// Grand Total =
// Wood Total + Others Total - Discount
//
// ============================================================

let grandTotal =
    Math.max(
        0,
        subtotal -
        discount
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

console.log(
    "DISCOUNT:",
    discount
);

console.log(
    "GRAND TOTAL:",
    grandTotal
);


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
// GRAND TOTAL DISPLAY
// ============================================================

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
// SAVE CURRENT TOTALS
// ============================================================

localStorage.setItem(
    "grandTotal",
    String(
        Math.round(
            grandTotal
        )
    )
);


localStorage.setItem(
    "finalTotal",
    String(
        Math.round(
            grandTotal
        )
    )
);


if (
    typeof saveTotals ===
    "function"
) {

    saveTotals({

        woodTotal:
            Math.round(
                woodTotal
            ),

        othersTotal:
            Math.round(
                othersTotal
            ),

        subtotal:
            Math.round(
                subtotal
            ),

        discount:
            Math.round(
                discount
            ),

        grandTotal:
            Math.round(
                grandTotal
            )

    });

}


// ============================================================
// ADVANCE AMOUNT
// ============================================================

const advanceData =
    centralBill.advance || {};


let advanceAmount =
    getNumber(
        advanceData.advanceAmount
    );


if (
    advanceAmount === 0
) {

    advanceAmount =
        getNumber(
            localStorage.getItem(
                "advanceAmount"
            )
        );

}


if (
    advanceAmount === 0
) {

    advanceAmount =
        getNumber(
            localStorage.getItem(
                "advance"
            )
        );

}


// ============================================================
// ADVANCE CANNOT EXCEED GRAND TOTAL
// ============================================================

if (
    advanceAmount >
    grandTotal
) {

    advanceAmount =
        grandTotal;

}


if (
    advanceAmount < 0
) {

    advanceAmount = 0;

}


// ============================================================
// BALANCE
// ============================================================

let balanceAmount =
    Math.max(
        0,
        grandTotal -
        advanceAmount
    );


localStorage.setItem(
    "advanceAmount",
    String(
        Math.round(
            advanceAmount
        )
    )
);


localStorage.setItem(
    "balanceAmount",
    String(
        Math.round(
            balanceAmount
        )
    )
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
            ).trim();


        const cft =
            getNumber(
                item.cubicFeet
            );


        const key =
            woodName
                .trim()
                .toLowerCase()
            +
            "||" +
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
// DISPLAY CFT SUMMARY
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
// EDIT BILL
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
// CONFIRM BILL
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
                    Math.round(
                        grandTotal
                    )
                )
            );


            localStorage.setItem(
                "advanceAmount",
                String(
                    Math.round(
                        advanceAmount
                    )
                )
            );


            localStorage.setItem(
                "balanceAmount",
                String(
                    Math.round(
                        balanceAmount
                    )
                )
            );


            localStorage.setItem(
                "billDiscount",
                String(
                    Math.round(
                        discount
                    )
                )
            );


            localStorage.setItem(
                "editingBill",
                "false"
            );


            window.location.href =
                "../html/confirm.html";

        }
    );

}


// ============================================================
// CLEAR ALL BILL DATA
// ONLY CLEAR BUTTON CAN DO THIS
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


            // =================================================
            // USE CENTRAL CLEAR FUNCTION
            // =================================================

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
// FINAL DEBUG
// ============================================================

console.log(
    "========================================="
);

console.log(
    "FINAL BILL DATA"
);

console.log(
    "Wood Total      :",
    woodTotal
);

console.log(
    "Labour Charge   :",
    labourCharge
);

console.log(
    "Other Charge    :",
    otherCharge
);

console.log(
    "Additional      :",
    additionalOthersTotal
);

console.log(
    "Others Total    :",
    othersTotal
);

console.log(
    "Subtotal        :",
    subtotal
);

console.log(
    "Discount        :",
    discount
);

console.log(
    "Grand Total     :",
    grandTotal
);

console.log(
    "Advance Amount  :",
    advanceAmount
);

console.log(
    "Balance Amount  :",
    balanceAmount
);

console.log(
    "========================================="
);

console.log(
    "BILL.JS READY"
);

console.log(
    "========================================="
);
