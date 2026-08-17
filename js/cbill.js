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

const grandTotalElement =
    document.getElementById("grandTotal");

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
// FORMAT MONEY
// =====================================================

function money(value) {

    const number =
        Number(value) || 0;

    return "₹ " + Math.round(number);

}


// =====================================================
// FORMAT DATE
// =====================================================

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
        String(date.getDate()).padStart(2, "0")
        + "/"
        +
        String(date.getMonth() + 1).padStart(2, "0")
        + "/"
        +
        date.getFullYear()
    );

}


// =====================================================
// FORMAT TIME
// =====================================================

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


// =====================================================
// LOAD EXACT BILL
// =====================================================

async function loadFinalBill() {

    if (!savedBillId) {

        console.error(
            "savedBillId is missing"
        );

        billNoElement.textContent =
            "---";

        return;

    }


    try {

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

        billNoElement.textContent =
            bill.bill_no || "---";


        // Save again
        if (bill.bill_no) {

            localStorage.setItem(
                "savedBillNo",
                bill.bill_no
            );

        }


        // =================================================
        // DATE
        // =================================================

        billDateElement.textContent =
            formatDate(bill.bill_date);


        // =================================================
        // TIME
        // =================================================

        let timeValue =
            bill.bill_time;


        if (!timeValue) {

            timeValue =
                bill.created_at;

        }


        billDayTimeElement.textContent =
            formatTime(timeValue);


        // =================================================
        // CUSTOMER
        // =================================================

        customerNameElement.textContent =
            bill.customer_name || "-";


        customerMobileElement.textContent =
            bill.customer_mobile || "-";


        customerPlaceElement.textContent =
            bill.customer_place || "-";


        // =================================================
        // TOTALS
        // =================================================

        const woodTotal =
            Number(bill.wood_total) || 0;


        const othersTotal =
            Number(bill.others_total) || 0;


        const grandTotal =
            Number(bill.grand_total) || 0;


        const balance =
            Number(bill.balance_amount) || 0;


        woodTotalElement.textContent =
            money(woodTotal);


        othersTotalElement.textContent =
            money(othersTotal);


        grandTotalElement.textContent =
            money(grandTotal);


        balanceAmountElement.textContent =
            money(balance);


        // =================================================
        // WOOD DATA
        // =================================================

        let woodData =
            bill.wood_data;


        if (typeof woodData === "string") {

            try {

                woodData =
                    JSON.parse(woodData);

            }
            catch (error) {

                woodData = [];

            }

        }


        if (!Array.isArray(woodData)) {

            woodData = [];

        }


        loadWoodData(woodData);


        // =================================================
        // OTHER CHARGES
        // =================================================

        let othersData =
            bill.others_data;


        if (typeof othersData === "string") {

            try {

                othersData =
                    JSON.parse(othersData);

            }
            catch (error) {

                othersData = [];

            }

        }


        if (!Array.isArray(othersData)) {

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


        console.log(
            "Final bill loaded successfully"
        );

    }

    catch (error) {

        console.error(
            "CBILL LOAD ERROR:",
            error
        );


        billNoElement.textContent =
            "---";


        alert(
            "Unable to load final bill."
        );

    }

}


// =====================================================
// LOAD WOOD DATA
// =====================================================

function loadWoodData(woodData) {

    woodTable.innerHTML = "";


    let sno = 1;


    if (woodData.length === 0) {

        woodTable.innerHTML = `
            <tr>
                <td colspan="10">-</td>
            </tr>
        `;

        return;

    }


    woodData.forEach(
        function(item) {


            // =============================================
            // NO PIECES
            // =============================================

            if (
                !item.pieces ||
                item.pieces.length === 0
            ) {

                const row =
                    document.createElement("tr");


                const woodName =
                    item.woodType === "Other"
                        ? item.otherWood
                        : item.woodType;


                row.innerHTML = `

                    <td>${sno}</td>

                    <td>
                        ${woodName || "-"}
                    </td>

                    <td>
                        ${item.breadth || 0}
                        ×
                        ${item.thickness || 0}
                    </td>

                    <td>-</td>

                    <td>-</td>

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
                        ${money(item.rate)}
                    </td>

                    <td>
                        ${money(item.amount)}
                    </td>

                    <td>
                        ${item.quality || "-"}
                    </td>

                `;


                woodTable.appendChild(row);

                sno++;

                return;

            }


            // =============================================
            // PIECES
            // =============================================

            item.pieces.forEach(
                function(piece, index) {


                    const row =
                        document.createElement("tr");


                    const length =
                        Number(piece.length || 0)
                        +
                        Number(
                            piece.extraLength || 0
                        );


                    if (index === 0) {

                        const woodName =
                            item.woodType === "Other"
                                ? item.otherWood
                                : item.woodType;


                        row.innerHTML = `

                            <td>${sno}</td>

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
                                ${money(item.rate)}
                            </td>

                            <td>
                                ${money(item.amount)}
                            </td>

                            <td>
                                ${item.quality || "-"}
                            </td>

                        `;

                    }
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


                    woodTable.appendChild(row);

                }
            );


            sno++;

        }
    );

}


// =====================================================
// OTHER CHARGES
// =====================================================

function loadOtherCharges(
    bill,
    othersData
) {

    chargeTable.innerHTML = "";


    let sno = 1;

    let hasCharge = false;


    // =================================================
    // LABOUR
    // =================================================

    const labour =
        Number(bill.labour_charge) || 0;


    if (labour > 0) {

        hasCharge = true;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${sno++}</td>

            <td>
                Labour Charge
            </td>

            <td>
                ${money(labour)}
            </td>

        `;


        chargeTable.appendChild(row);

    }


    // =================================================
    // OTHER CHARGE
    // =================================================

    const otherCharge =
        Number(bill.other_charge) || 0;


    if (otherCharge > 0) {

        hasCharge = true;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${sno++}</td>

            <td>
                Other Charge
            </td>

            <td>
                ${money(otherCharge)}
            </td>

        `;


        chargeTable.appendChild(row);

    }


    // =================================================
    // ADDITIONAL CHARGES
    // =================================================

    othersData.forEach(
        function(item) {

            hasCharge = true;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${sno++}</td>

                <td>
                    ${item.name || "-"}
                </td>

                <td>
                    ${money(item.amount)}
                </td>

            `;


            chargeTable.appendChild(row);

        }
    );


    // =================================================
    // NO CHARGES
    // =================================================

    if (!hasCharge) {

        chargeTable.innerHTML = `

            <tr>

                <td>-</td>

                <td>-</td>

                <td>-</td>

            </tr>

        `;

    }

}


// =====================================================
// CFT SUMMARY
// =====================================================

function loadCftSummary(woodData) {

    cftSummary.innerHTML = "";


    const summary = {};


    woodData.forEach(
        function(item) {


            let name =
                item.woodType;


            if (name === "Other") {

                name =
                    item.otherWood;

            }


            if (!name) {

                name = "Unknown";

            }


            const cft =
                Number(
                    item.cubicFeet || 0
                );


            if (
                summary[name] !== undefined
            ) {

                summary[name] += cft;

            }
            else {

                summary[name] = cft;

            }

        }
    );


    Object.keys(summary).forEach(
        function(name) {


            const p =
                document.createElement("p");


            p.innerHTML = `

                <b>${name}</b>

                <span>
                    : ${summary[name].toFixed(2)} CFT
                </span>

            `;


            cftSummary.appendChild(p);

        }
    );

}


// =====================================================
// PRINT
// =====================================================

printBtn.addEventListener(
    "click",
    function() {

        window.print();

    }
);


// =====================================================
// HOME
// =====================================================

homeBtn.addEventListener(
    "click",
    function() {

        window.location.href =
            "../html/index.html";

    }
);


// =====================================================
// START
// =====================================================

loadFinalBill();
