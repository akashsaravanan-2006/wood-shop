// =========================================
// BILL.JS
// QUOTATION PAGE
// =========================================


// =========================================
// BILL NUMBER + CUSTOMER ID
// =========================================
// IMPORTANT:
//
// bill.html is ONLY the quotation page.
//
// Bill No      = ---
// Customer ID  = ---
//
// The actual Bill No and Customer ID
// will be displayed later in cbill.html
// after the bill is confirmed and saved.
//
// =========================================

const billNoElement =
    document.getElementById("billNo");

const customerIdElement =
    document.getElementById("customerId");


// =========================================
// ALWAYS SHOW ---
// =========================================

if (billNoElement) {

    billNoElement.textContent = "---";

}

if (customerIdElement) {

    customerIdElement.textContent = "---";

}


// =========================================
// BILL DATE
// =========================================

const billDate =
    document.getElementById("billDate");

let savedDate =
    localStorage.getItem("billDate");

const days = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


// =========================================
// DATE ALREADY EXISTS
// =========================================

if (savedDate) {

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


    const billDayTime =
        document.getElementById(
            "billDayTime"
        );


    if (billDayTime) {

        billDayTime.textContent =
            days[now.getDay()] +
            " | " +
            time;

    }

}


// =========================================
// CREATE NEW DATE
// =========================================

else {

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


    if (billDate) {

        billDate.textContent =
            savedDate;

    }


    const time =
        today.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


    const billDayTime =
        document.getElementById(
            "billDayTime"
        );


    if (billDayTime) {

        billDayTime.textContent =
            days[today.getDay()] +
            " | " +
            time;

    }


    localStorage.setItem(
        "billDate",
        savedDate
    );

}


// =========================================
// CUSTOMER DETAILS
// =========================================

const customerName =
    document.getElementById(
        "customerName"
    );


if (customerName) {

    customerName.textContent =
        localStorage.getItem(
            "customerName"
        ) || "-";

}


const customerMobile =
    document.getElementById(
        "customerMobile"
    );


if (customerMobile) {

    customerMobile.textContent =
        localStorage.getItem(
            "customerMobile"
        ) || "-";

}


const customerPlace =
    document.getElementById(
        "customerPlace"
    );


if (customerPlace) {

    customerPlace.textContent =
        localStorage.getItem(
            "customerPlace"
        ) || "-";

}


// =========================================
// TOTALS
// =========================================

const woodTotal =
    Number(
        localStorage.getItem(
            "woodTotal"
        )
    ) || 0;


const othersTotal =
    Number(
        localStorage.getItem(
            "othersTotal"
        )
    ) || 0;


const grandTotal =
    Number(
        localStorage.getItem(
            "finalTotal"
        )
    ) || 0;


// =========================================
// WOOD TOTAL
// =========================================

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );


if (woodTotalElement) {

    woodTotalElement.textContent =
        "₹ " +
        Math.round(
            woodTotal
        );

}


// =========================================
// OTHERS TOTAL
// =========================================

const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );


if (othersTotalElement) {

    othersTotalElement.textContent =
        "₹ " +
        Math.round(
            othersTotal
        );

}


// =========================================
// GRAND TOTAL
// =========================================

const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );


if (grandTotalElement) {

    grandTotalElement.textContent =
        "₹ " +
        Math.round(
            grandTotal
        );

}


// =========================================
// ADVANCE & BALANCE
// =========================================

const advanceAmount =
    Number(
        localStorage.getItem(
            "advanceAmount"
        )
    ) || 0;


const balanceAmount =
    Number(
        localStorage.getItem(
            "balanceAmount"
        )
    ) || 0;


// =========================================
// ADVANCE DISPLAY
// =========================================

const advanceElement =
    document.getElementById(
        "advanceAmount"
    );


if (advanceElement) {

    advanceElement.textContent =
        "₹ " +
        Math.round(
            advanceAmount
        );

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
        "₹ " +
        Math.round(
            balanceAmount
        );

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


let sno = 1;


// =========================================
// PRINT WOOD DETAILS
// =========================================

if (woodTable) {

    woodData.forEach(
        function (item) {


            // =================================
            // NO PIECES
            // =================================

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
                        ${
                            item.woodType === "Other"
                                ? item.otherWood || "-"
                                : item.woodType || "-"
                        }
                    </td>

                    <td>
                        ${item.breadth || "-"}
                        ×
                        ${item.thickness || "-"}
                    </td>

                    <td>-</td>

                    <td>-</td>

                    <td>
                        ${Math.round(
                            Number(
                                item.totalLength || 0
                            )
                        )}
                    </td>

                    <td>
                        ${Number(
                            item.cubicFeet || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ₹ ${Math.round(
                            Number(
                                item.rate || 0
                            )
                        )}
                    </td>

                    <td>
                        ₹ ${Math.round(
                            Number(
                                item.amount || 0
                            )
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


            // =================================
            // PIECES
            // =================================

            item.pieces.forEach(
                function (piece, index) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const length =
                        Number(
                            piece.length
                        ) || 0;


                    const extraLength =
                        Number(
                            piece.extraLength
                        ) || 0;


                    const lengthText =
                        length +
                        extraLength;


                    // =================================
                    // FIRST PIECE
                    // =================================

                    if (index === 0) {

                        row.innerHTML = `

                            <td>
                                ${sno}
                            </td>

                            <td>
                                ${
                                    item.woodType === "Other"
                                        ? item.otherWood || "-"
                                        : item.woodType || "-"
                                }
                            </td>

                            <td>
                                ${item.breadth || "-"}
                                ×
                                ${item.thickness || "-"}
                            </td>

                            <td>
                                ${lengthText}
                            </td>

                            <td>
                                ${piece.qty || 0}
                            </td>

                            <td>
                                ${Math.round(
                                    Number(
                                        piece.totalLength || 0
                                    )
                                )}
                            </td>

                            <td>
                                ${Number(
                                    item.cubicFeet || 0
                                ).toFixed(2)}
                            </td>

                            <td>
                                ₹ ${Math.round(
                                    Number(
                                        item.rate || 0
                                    )
                                )}
                            </td>

                            <td>
                                ₹ ${Math.round(
                                    Number(
                                        item.amount || 0
                                    )
                                )}
                            </td>

                            <td>
                                ${item.quality || "-"}
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
                                ${piece.qty || 0}
                            </td>

                            <td>
                                ${Math.round(
                                    Number(
                                        piece.totalLength || 0
                                    )
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
// LOAD OTHER CHARGES
// =========================================

let chargeSno = 1;


const labourCharge =
    Number(
        localStorage.getItem(
            "labourCharge"
        )
    ) || 0;


const otherCharge =
    Number(
        localStorage.getItem(
            "otherCharge"
        )
    ) || 0;


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
            ₹ ${Math.round(
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
            ₹ ${Math.round(
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
                    ${item.name || "-"}
                </td>

                <td>
                    ₹ ${Math.round(
                        Number(
                            item.amount || 0
                        )
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
// PRINT BUTTON
// =========================================
// IMPORTANT:
//
// This is still the quotation page.
// Keep the existing print functionality.
//
// Later we will change the CONFIRM page
// Print button to open cbill.html.
//
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

const buttons =
    document.querySelectorAll(
        ".buttons button"
    );


const backBtn =
    buttons.length > 0
        ? buttons[buttons.length - 1]
        : null;


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}


// =========================================
// PRINT CALLBACK
// =========================================

window.onafterprint =
    function () {

        console.log(
            "Quotation Printed Successfully"
        );

    };


// =========================================
// CFT SUMMARY
// =========================================

const cftSummary = {};


woodData.forEach(
    function (item) {

        let name =
            item.woodType ||
            "Unknown";


        if (
            name === "Other"
        ) {

            name =
                item.otherWood ||
                "Other";

        }


        const cft =
            Number(
                item.cubicFeet || 0
            );


        if (
            cftSummary[name]
        ) {

            cftSummary[name] +=
                cft;

        }

        else {

            cftSummary[name] =
                cft;

        }

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


    for (
        const wood in cftSummary
    ) {

        cftDiv.innerHTML += `

            <p>

                <b>
                    ${wood}
                </b>

                :

                ${cftSummary[wood].toFixed(2)}

                CFT

            </p>

        `;

    }

}


// =========================================
// CONFIRM BILL BUTTON
// =========================================

const confirmBillBtn =
    document.getElementById(
        "confirmBill"
    );


if (confirmBillBtn) {

    confirmBillBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../html/confirm.html";

        }
    );

}
