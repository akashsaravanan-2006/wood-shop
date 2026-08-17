// =====================================================
// CBILL.JS
// FINAL CONFIRMED BILL
// =====================================================


// =====================================================
// GET SAVED BILL INFORMATION
// =====================================================

const savedBillNo =
    localStorage.getItem(
        "savedBillNo"
    );


const savedCustomerId =
    localStorage.getItem(
        "savedCustomerId"
    );


// =====================================================
// BILL NUMBER
// =====================================================

const billNoElement =
    document.getElementById(
        "billNo"
    );


if (billNoElement) {

    billNoElement.textContent =
        savedBillNo || "---";

}


// =====================================================
// CUSTOMER ID
// =====================================================

const customerIdElement =
    document.getElementById(
        "customerId"
    );


if (customerIdElement) {

    customerIdElement.textContent =
        savedCustomerId || "---";

}


// =====================================================
// DATE
// =====================================================

const billDateElement =
    document.getElementById(
        "billDate"
    );


const savedDate =
    localStorage.getItem(
        "billDate"
    );


if (billDateElement) {

    billDateElement.textContent =
        savedDate || "---";

}


// =====================================================
// DAY + TIME
// =====================================================

const now =
    new Date();


const days = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


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


const billDayTimeElement =
    document.getElementById(
        "billDayTime"
    );


if (billDayTimeElement) {

    billDayTimeElement.textContent =
        days[now.getDay()] +
        " | " +
        time;

}


// =====================================================
// CUSTOMER DETAILS
// =====================================================

const customerNameElement =
    document.getElementById(
        "customerName"
    );


if (customerNameElement) {

    customerNameElement.textContent =
        localStorage.getItem(
            "customerName"
        ) || "-";

}


const customerMobileElement =
    document.getElementById(
        "customerMobile"
    );


if (customerMobileElement) {

    customerMobileElement.textContent =
        localStorage.getItem(
            "customerMobile"
        ) || "-";

}


const customerPlaceElement =
    document.getElementById(
        "customerPlace"
    );


if (customerPlaceElement) {

    customerPlaceElement.textContent =
        localStorage.getItem(
            "customerPlace"
        ) || "-";

}


// =====================================================
// TOTALS
// =====================================================

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
    ) ||
    Number(
        localStorage.getItem(
            "grandTotal"
        )
    ) ||
    0;


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


// =====================================================
// DISPLAY TOTALS
// =====================================================

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


// =====================================================
// LOAD WOOD DATA
// =====================================================

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
        "WOOD DATA ERROR:",
        error
    );

    woodData = [];

}


const woodTable =
    document.getElementById(
        "woodTable"
    );


let sno = 1;


// =====================================================
// DISPLAY WOOD
// =====================================================

if (woodTable) {

    woodData.forEach(
        function (item) {


            // =========================================
            // NO PIECES
            // =========================================

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

                    <td>
                        -
                    </td>

                    <td>
                        -
                    </td>

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


            // =========================================
            // PIECES
            // =========================================

            item.pieces.forEach(
                function (
                    piece,
                    index
                ) {


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


// =====================================================
// OTHER CHARGES
// =====================================================

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


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
        "OTHER DATA ERROR:",
        error
    );

    othersData = [];

}


let chargeSno = 1;

let hasCharge = false;


// =====================================================
// LABOUR CHARGE
// =====================================================

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


// =====================================================
// OTHER CHARGE
// =====================================================

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


// =====================================================
// ADDITIONAL CHARGES
// =====================================================

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


// =====================================================
// NO CHARGES
// =====================================================

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


// =====================================================
// CFT SUMMARY
// =====================================================

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


// =====================================================
// REMARK
// =====================================================

const remarkElement =
    document.getElementById(
        "remark"
    );


if (remarkElement) {

    remarkElement.textContent =
        localStorage.getItem(
            "remark"
        ) || "-";

}


// =====================================================
// PRINT BUTTON
// =====================================================

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


// =====================================================
// HOME BUTTON
// =====================================================

const homeBtn =
    document.getElementById(
        "homeBtn"
    );


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "../html/index.html";

        }
    );

}
