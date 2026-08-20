// ===========================================
// LABOUR.JS
// CENTRAL STORAGE VERSION
// ===========================================


// ===========================================
// CHECK STORE DATA
// ===========================================

if (
    typeof getPageData !== "function" ||
    typeof savePageData !== "function"
) {

    console.error(
        "storedata.js is not loaded before labour.js"
    );

    alert(
        "Storage system not loaded. Please check storedata.js."
    );

}


// ===========================================
// LOAD WOOD TOTAL
// ===========================================

let woodTotal =
    parseFloat(
        localStorage.getItem("woodTotal")
    ) || 0;


// ===========================================
// HTML ELEMENTS
// ===========================================

const woodTotalDisplay =
    document.getElementById("woodTotal");

const labourCharge =
    document.getElementById("labourCharge");

const otherCharge =
    document.getElementById("otherCharge");

const othersTotal =
    document.getElementById("othersTotal");

const finalTotal =
    document.getElementById("finalTotal");

const othersBody =
    document.getElementById("othersBody");

const otherSection =
    document.getElementById("otherSection");

const addOtherBtn =
    document.getElementById("addOther");

const confirmBtn =
    document.getElementById("confirmBtn");

const backBtn =
    document.getElementById("backBtn");


// ===========================================
// DISPLAY WOOD TOTAL
// ===========================================

if (woodTotalDisplay) {

    woodTotalDisplay.innerHTML =
        "₹ " +
        woodTotal.toFixed(2);

}


// ===========================================
// LOAD SAVED LABOUR DATA
// ===========================================

const savedLabour =
    getPageData("labour");


console.log(
    "Loaded Labour Data:",
    savedLabour
);


// ===========================================
// RESTORE BASIC LABOUR VALUES
// ===========================================

if (labourCharge) {

    labourCharge.value =
        savedLabour.labourCharge || "";

}


if (otherCharge) {

    otherCharge.value =
        savedLabour.otherCharge || "";

}


// ===========================================
// RESTORE OTHER CHARGES
// ===========================================

if (
    Array.isArray(
        savedLabour.othersData
    )
) {

    savedLabour.othersData.forEach(
        function (item) {

            createOtherRow(
                item.name || "",
                item.amount || ""
            );

        }
    );

}


// ===========================================
// SHOW OTHER SECTION IF DATA EXISTS
// ===========================================

if (
    Array.isArray(
        savedLabour.othersData
    ) &&
    savedLabour.othersData.length > 0
) {

    if (otherSection) {

        otherSection.style.display =
            "block";

    }

}


// ===========================================
// CREATE OTHER CHARGE ROW
// ===========================================

function createOtherRow(
    name = "",
    amount = ""
) {

    if (!othersBody) {
        return;
    }


    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>

            <input
                type="text"
                class="otherName"
                placeholder="Charge Name"
                value="${escapeHTML(name)}">

        </td>

        <td>

            <input
                type="number"
                class="otherAmount"
                placeholder="0"
                min="0"
                value="${amount}">

        </td>

        <td>

            <button
                type="button"
                class="removeBtn">

                Remove

            </button>

        </td>

    `;


    othersBody.appendChild(row);

}


// ===========================================
// ESCAPE HTML
// ===========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===========================================
// GET ALL OTHER CHARGES
// ===========================================

function getOthersData() {

    const othersData = [];


    if (!othersBody) {

        return othersData;

    }


    othersBody
        .querySelectorAll("tr")
        .forEach(
            function (row) {

                const nameInput =
                    row.querySelector(
                        ".otherName"
                    );

                const amountInput =
                    row.querySelector(
                        ".otherAmount"
                    );


                if (
                    !nameInput ||
                    !amountInput
                ) {

                    return;

                }


                const name =
                    nameInput.value.trim();


                const amount =
                    Number(
                        amountInput.value
                    ) || 0;


                if (
                    name !== "" ||
                    amount > 0
                ) {

                    othersData.push({

                        name: name,

                        amount: amount

                    });

                }

            }
        );


    return othersData;

}


// ===========================================
// CALCULATE TOTALS
// ===========================================

function updateTotals() {

    const labour =
        Number(
            labourCharge?.value
        ) || 0;


    const other =
        Number(
            otherCharge?.value
        ) || 0;


    let extra = 0;


    if (othersBody) {

        othersBody
            .querySelectorAll(
                ".otherAmount"
            )
            .forEach(
                function (input) {

                    extra +=
                        Number(
                            input.value
                        ) || 0;

                }
            );

    }


    const others =
        labour +
        other +
        extra;


    const grand =
        woodTotal +
        others;


    // =====================================
    // DISPLAY
    // =====================================

    if (othersTotal) {

        othersTotal.innerHTML =
            "₹ " +
            others.toFixed(2);

    }


    if (finalTotal) {

        finalTotal.innerHTML =
            "₹ " +
            grand.toFixed(2);

    }


    // =====================================
    // SAVE CURRENT LABOUR DATA
    // =====================================

    saveLabourData();

}


// ===========================================
// SAVE LABOUR DATA
// ===========================================

function saveLabourData() {

    const labour =
        Number(
            labourCharge?.value
        ) || 0;


    const other =
        Number(
            otherCharge?.value
        ) || 0;


    const othersData =
        getOthersData();


    let extraTotal = 0;


    othersData.forEach(
        function (item) {

            extraTotal +=
                Number(
                    item.amount
                ) || 0;

        }
    );


    const othersTotalValue =
        labour +
        other +
        extraTotal;


    const finalTotalValue =
        woodTotal +
        othersTotalValue;


    // =====================================
    // CENTRAL STORAGE
    // =====================================

    savePageData(
        "labour",
        {

            labourCharge:
                String(labour),

            otherCharge:
                String(other),

            othersData:
                othersData,

            othersTotal:
                othersTotalValue,

            finalTotal:
                finalTotalValue

        }
    );


    // =====================================
    // KEEP OLD TOTAL KEYS
    // FOR YOUR EXISTING BILL CODE
    // =====================================

    localStorage.setItem(
        "woodTotal",
        String(woodTotal)
    );


    localStorage.setItem(
        "othersTotal",
        String(othersTotalValue)
    );


    localStorage.setItem(
        "finalTotal",
        String(finalTotalValue)
    );


    console.log(
        "Labour data saved:",
        getPageData("labour")
    );

}


// ===========================================
// LABOUR INPUT
// ===========================================

if (labourCharge) {

    labourCharge.addEventListener(
        "input",
        updateTotals
    );

}


// ===========================================
// OTHER CHARGE INPUT
// ===========================================

if (otherCharge) {

    otherCharge.addEventListener(
        "input",
        updateTotals
    );

}


// ===========================================
// OTHER AMOUNT INPUT
// ===========================================

if (othersBody) {

    othersBody.addEventListener(
        "input",
        function (e) {

            if (
                e.target.classList.contains(
                    "otherAmount"
                ) ||
                e.target.classList.contains(
                    "otherName"
                )
            ) {

                updateTotals();

            }

        }
    );

}


// ===========================================
// ADD OTHER CHARGE
// ===========================================

if (addOtherBtn) {

    addOtherBtn.addEventListener(
        "click",
        function () {

            if (otherSection) {

                otherSection.style.display =
                    "block";

            }


            createOtherRow();


            updateTotals();

        }
    );

}


// ===========================================
// REMOVE OTHER CHARGE
// ===========================================

if (othersBody) {

    othersBody.addEventListener(
        "click",
        function (e) {

            if (
                e.target.classList.contains(
                    "removeBtn"
                )
            ) {

                const row =
                    e.target.closest("tr");


                if (row) {

                    row.remove();

                }


                if (
                    othersBody.rows.length === 0
                ) {

                    if (otherSection) {

                        otherSection.style.display =
                            "none";

                    }

                }


                updateTotals();

            }

        }
    );

}


// ===========================================
// CONFIRM BUTTON
// ===========================================

if (confirmBtn) {

    confirmBtn.addEventListener(
        "click",
        function () {

            // Save before leaving
            saveLabourData();


            // Go to Personal page
            window.location.href =
                "personal.html";

        }
    );

}


// ===========================================
// BACK BUTTON
// ===========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            // IMPORTANT:
            // Save before going back

            saveLabourData();


            window.location.href =
                "wood.html";

        }
    );

}


// ===========================================
// INITIAL CALCULATION
// ===========================================

updateTotals();


console.log(
    "LABOUR PAGE READY"
);
