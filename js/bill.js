// =========================================
// BILL.JS
// WOOD BILL / QUOTATION PAGE
// =========================================


// =========================================
// BILL NUMBER
// =========================================

const billNoElement =
    document.getElementById("billNo");


if (billNoElement) {

    /*
       This is still quotation stage.
       Actual bill number can be generated
       after confirmation.
    */

    billNoElement.textContent = "---";

}


// =========================================
// BILL DATE
// =========================================

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


// =========================================
// CUSTOMER DETAILS
// =========================================

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
        localStorage.getItem(
            "customerName"
        ) || "-";

}


if (customerMobile) {

    customerMobile.textContent =
        localStorage.getItem(
            "customerMobile"
        ) || "-";

}


if (customerPlace) {

    customerPlace.textContent =
        localStorage.getItem(
            "customerPlace"
        ) || "-";

}


// =========================================
// HELPERS
// =========================================

function getNumber(value) {

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


function money(value) {

    return "₹ " +
        Math.round(
            getNumber(value)
        );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================
// LOAD WOOD DATA
// =========================================

let woodData = [];


try {

    woodData =
        JSON.parse(
            localStorage.getItem(
                "woodData"
            )
        ) || [];


}
catch (error) {

    console.error(
        "Unable to read woodData:",
        error
    );


    woodData = [];

}


// Make sure array

if (!Array.isArray(woodData)) {

    woodData = [];

}


// =========================================
// TABLE REFERENCES
// =========================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


const chargeTable =
    document.getElementById(
        "chargeTable"
    );


// =========================================
// PRINT WOOD DETAILS
// =========================================

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


            // =====================================
            // WOOD NAME
            // =====================================

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


            // =====================================
            // SIZE
            // =====================================

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


            // =====================================
            // QUALITY
            // =====================================

            const quality =
                String(
                    item.quality ??
                    "1"
                ).trim();


            // =====================================
            // RATE
            // =====================================

            const rate =
                getNumber(
                    item.rate
                );


            // =====================================
            // AMOUNT
            // =====================================

            const amount =
                getNumber(
                    item.amount
                );


            // =====================================
            // NO PIECES
            // =====================================

            if (
                !item.pieces ||
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

                    <td>
                        -
                    </td>

                    <td>
                        -
                    </td>

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


            // =====================================
            // PIECES
            // =====================================

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


                    // =================================
                    // FIRST PIECE
                    // =================================

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


                    // =================================
                    // ADDITIONAL PIECES
                    // =================================

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


// =========================================
// OTHER CHARGES
// =========================================

let chargeSno = 1;


const labourCharge =
    getNumber(
        localStorage.getItem(
            "labourCharge"
        )
    );


const otherCharge =
    getNumber(
        localStorage.getItem(
            "otherCharge"
        )
    );


let othersData = [];


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


if (!Array.isArray(othersData)) {

    othersData = [];

}


let hasCharge = false;


// =========================================
// LABOUR CHARGE
// =========================================

if (
    chargeTable &&
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


// =========================================
// OTHER CHARGE
// =========================================

if (
    chargeTable &&
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


// =========================================
// ADDITIONAL OTHER CHARGES
// =========================================

if (chargeTable) {

    othersData.forEach(
        function (item) {

            if (!item) {
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
                        item.name || "-"
                    )}
                </td>

                <td>
                    ${money(
                        item.amount
                    )}
                </td>

            `;


            chargeTable.appendChild(
                row
            );

        }
    );

}


// =========================================
// NO CHARGES
// =========================================

if (
    chargeTable &&
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


// =========================================
// WOOD TOTAL
// =========================================

const woodTotal =
    getNumber(
        localStorage.getItem(
            "woodTotal"
        )
    );


// =========================================
// OTHERS TOTAL
// =========================================

const othersTotal =
    getNumber(
        localStorage.getItem(
            "othersTotal"
        )
    );


// =========================================
// SUBTOTAL
// =========================================

const subtotal =
    woodTotal +
    othersTotal;


const subtotalElement =
    document.getElementById(
        "subtotal"
    );


if (subtotalElement) {

    subtotalElement.textContent =
        money(subtotal);

}


// =========================================
// WOOD TOTAL DISPLAY
// =========================================

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );


if (woodTotalElement) {

    woodTotalElement.textContent =
        money(woodTotal);

}


// =========================================
// OTHERS TOTAL DISPLAY
// =========================================

const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );


if (othersTotalElement) {

    othersTotalElement.textContent =
        money(othersTotal);

}


// =========================================
// DISCOUNT
//
// Advance page may use any of these keys.
// =========================================

let discount =
    getNumber(
        localStorage.getItem(
            "discountAmount"
        )
    );


if (discount === 0) {

    discount =
        getNumber(
            localStorage.getItem(
                "discount"
            )
        );

}


if (discount === 0) {

    discount =
        getNumber(
            localStorage.getItem(
                "discountValue"
            )
        );

}


if (discount === 0) {

    discount =
        getNumber(
            localStorage.getItem(
                "billDiscount"
            )
        );

}


// Discount cannot be negative

if (discount < 0) {

    discount = 0;

}


// Discount cannot exceed subtotal

if (discount > subtotal) {

    discount = subtotal;

}


// =========================================
// GRAND TOTAL
//
// If advance page has finalTotal,
// use it.
// Otherwise calculate subtotal - discount.
// =========================================

const savedFinalTotal =
    getNumber(
        localStorage.getItem(
            "finalTotal"
        )
    );


let grandTotal;


if (
    savedFinalTotal > 0
) {

    /*
       If finalTotal is exactly subtotal
       and discount exists, then discount
       has NOT been removed yet.
    */

    if (
        discount > 0 &&
        savedFinalTotal === subtotal
    ) {

        grandTotal =
            subtotal -
            discount;

    }

    else {

        grandTotal =
            savedFinalTotal;

    }

}

else {

    grandTotal =
        Math.max(
            0,
            subtotal - discount
        );

}


// =========================================
// DISCOUNT DISPLAY
// =========================================

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
            money(discount);

    }

}

else {

    if (discountRow) {

        discountRow.style.display =
            "none";

    }

}


// =========================================
// GRAND TOTAL DISPLAY
// =========================================

const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );


if (grandTotalElement) {

    grandTotalElement.textContent =
        money(grandTotal);

}


// =========================================
// ADVANCE AMOUNT
// =========================================

let advanceAmount =
    getNumber(
        localStorage.getItem(
            "advanceAmount"
        )
    );


/*
   Alternative key support.
*/

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


if (
    advanceAmount === 0
) {

    advanceAmount =
        getNumber(
            localStorage.getItem(
                "advanceValue"
            )
        );

}


// Advance cannot exceed grand total

if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;

}


if (
    advanceAmount < 0
) {

    advanceAmount = 0;

}


// =========================================
// BALANCE
// =========================================

let balanceAmount =
    getNumber(
        localStorage.getItem(
            "balanceAmount"
        )
    );


/*
   Always calculate balance from
   Grand Total - Advance.
*/

balanceAmount =
    Math.max(
        0,
        grandTotal -
        advanceAmount
    );


// Save updated balance

localStorage.setItem(
    "balanceAmount",
    String(
        Math.round(
            balanceAmount
        )
    )
);


// =========================================
// ADVANCE DISPLAY
// =========================================

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


// =========================================
// BALANCE DISPLAY
// =========================================

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


// =========================================
// CFT SUMMARY
//
// IMPORTANT:
//
// GROUP = WOOD TYPE + QUALITY
//
// Teak Quality 1
// Teak Quality 2
//
// are completely separate.
//
// Example:
//
// Teak (1)   : 15.20 CFT
// Teak (2)   : 8.50 CFT
// Neem (1)   : 4.20 CFT
// =========================================

const cftSummary = {};


woodData.forEach(
    function (item) {


        // =====================================
        // WOOD NAME
        // =====================================

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


        // =====================================
        // QUALITY
        // =====================================

        const quality =
            String(
                item.quality ??
                "1"
            ).trim();


        // =====================================
        // CFT
        // =====================================

        const cft =
            getNumber(
                item.cubicFeet
            );


        // =====================================
        // CREATE UNIQUE KEY
        //
        // teak + 1
        // teak + 2
        //
        // will become:
        //
        // teak||1
        // teak||2
        // =====================================

        const key =
            woodName
                .trim()
                .toLowerCase()
            +
            "||"
            +
            quality;


        // =====================================
        // CREATE GROUP
        // =====================================

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


        // =====================================
        // ADD ONLY SAME WOOD + SAME QUALITY
        // =====================================

        cftSummary[key].cft +=
            cft;

    }
);


// =========================================
// DISPLAY CFT SUMMARY
// =========================================

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


// =========================================
// EDIT BILL BUTTON
//
// IMPORTANT:
//
// DO NOT DELETE WOOD DATA.
//
// Set editing mode and go back to wood page.
// =========================================

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {


            /*
               Tell wood page that this is
               an existing bill being edited.
            */

            localStorage.setItem(
                "editingBill",
                "true"
            );


            /*
               DO NOT REMOVE:
               woodData
               othersData
               customerName
               customerMobile
               customerPlace
               advanceAmount
               discount
            */


            window.location.href =
                "wood.html";

        }
    );

}


// =========================================
// PRINT BUTTON
// =========================================

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


// =========================================
// BACK BUTTON
// =========================================

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


// =========================================
// CONFIRM BILL
//
// IMPORTANT:
//
// Do NOT clear woodData here if
// confirm.html is still part of your
// confirmation process.
//
// We only mark the bill as confirmed.
// =========================================

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


            /*
               Mark bill as confirmed.
            */

            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            /*
               Save final bill values.
            */

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


            /*
               Keep editing data until the
               COMPLETE bill process finishes.
            */

            localStorage.setItem(
                "editingBill",
                "false"
            );


            /*
               Your existing confirmation page.
            */

            window.location.href =
                "../html/confirm.html";

        }
    );

}


// =========================================
// DEBUG
// =========================================

console.log(
    "=============================="
);

console.log(
    "WOOD BILL LOADED"
);

console.log(
    "Wood Data:",
    woodData
);

console.log(
    "CFT Summary:",
    cftSummary
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
    "=============================="
);/// =========================================
// CLEAR ALL BILL DATA
// =========================================

const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {

    clearBtn.addEventListener("click", function () {

        const confirmClear = window.confirm(
            "Are you sure you want to clear ALL bill data?"
        );

        if (!confirmClear) {
            return;
        }

        // =====================================
        // CLEAR CENTRAL STORAGE
        // =====================================

        localStorage.removeItem("current_bill_data");


        // =====================================
        // CLEAR WOOD DATA
        // =====================================

        localStorage.removeItem("woodData");
        localStorage.removeItem("wood_page_data");


        // =====================================
        // CLEAR LABOUR DATA
        // =====================================

        localStorage.removeItem("labourCharge");
        localStorage.removeItem("otherCharge");
        localStorage.removeItem("othersData");


        // =====================================
        // CLEAR PERSONAL DATA
        // =====================================

        localStorage.removeItem("customerName");
        localStorage.removeItem("customerMobile");
        localStorage.removeItem("customerPlace");


        // =====================================
        // CLEAR ADVANCE DATA
        // =====================================

        localStorage.removeItem("advanceAmount");
        localStorage.removeItem("balanceAmount");
        localStorage.removeItem("paymentType");
        localStorage.removeItem("paymentMode");


        // =====================================
        // CLEAR TOTALS
        // =====================================

        localStorage.removeItem("grandTotal");
        localStorage.removeItem("finalTotal");


        // =====================================
        // CLEAR DISCOUNT
        // =====================================

        localStorage.removeItem("discountAmount");
        localStorage.removeItem("discountApplied");
        localStorage.removeItem("billDiscount");
        localStorage.removeItem("finalGrandTotal");


        // =====================================
        // CLEAR BILL STATUS
        // =====================================

        localStorage.removeItem("billConfirmed");
        localStorage.removeItem("billConfirmedAt");
        localStorage.removeItem("editingBill");
        localStorage.removeItem("billDate");


        // =====================================
        // CLEAR SESSION STORAGE TOO
        // =====================================

        sessionStorage.removeItem("wood_page_data");
        sessionStorage.removeItem("current_bill_data");


        // =====================================
        // GO HOME
        // =====================================

        window.location.href = "index.html";

    });

}
