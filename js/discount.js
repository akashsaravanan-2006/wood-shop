// ============================================================
// DISCOUNT.JS
// FLOW:
// WOOD → LABOUR → PERSONAL → DISCOUNT → ADVANCE → BILL
// ============================================================

console.log("========================================");
console.log("DISCOUNT.JS LOADED");
console.log("========================================");


// ============================================================
// ELEMENTS
// ============================================================

const currentTotalEl =
    document.getElementById("currentTotal");

const discountAmountEl =
    document.getElementById("discountAmount");

const newGrandTotalEl =
    document.getElementById("newGrandTotal");

const calculateDiscountBtn =
    document.getElementById("calculateDiscountBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");

const discountSection =
    document.getElementById("discountSection");

const discountOptions =
    document.querySelectorAll(
        'input[name="discountOption"]'
    );


// ============================================================
// DATA
// ============================================================

let currentGrandTotal = 0;

let discountAmount = 0;

let newGrandTotal = 0;


// ============================================================
// NUMBER
// ============================================================

function getNumber(value) {

    const number =
        parseFloat(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// ROUND MONEY
// ============================================================

function roundMoney(value) {

    return Math.round(
        (
            getNumber(value) +
            Number.EPSILON
        ) * 100
    ) / 100;

}


// ============================================================
// DISPLAY MONEY
// ============================================================

function formatMoney(value) {

    return (
        "₹ " +
        roundMoney(value).toFixed(2)
    );

}


// ============================================================
// GET CURRENT GRAND TOTAL
// ============================================================
//
// Priority:
//
// 1. labourData.grandTotal
// 2. labourFinalTotal
// 3. labourBaseTotal
// 4. grandTotal
// 5. finalTotal
// 6. central bill totals
//
// ============================================================

function getCurrentGrandTotal() {

    let value = 0;


    // ========================================================
    // 1. LABOUR DATA
    // ========================================================

    const labourDataText =
        localStorage.getItem(
            "labourData"
        );


    if (
        labourDataText
    ) {

        try {

            const labourData =
                JSON.parse(
                    labourDataText
                );


            console.log(
                "LABOUR DATA:",
                labourData
            );


            if (
                labourData &&
                labourData.grandTotal !==
                undefined
            ) {

                value =
                    getNumber(
                        labourData.grandTotal
                    );

            }

        }
        catch (error) {

            console.error(
                "LABOUR DATA ERROR:",
                error
            );

        }

    }


    // ========================================================
    // 2. LABOUR FINAL TOTAL
    // ========================================================

    if (
        value === 0
    ) {

        value =
            getNumber(
                localStorage.getItem(
                    "labourFinalTotal"
                )
            );

    }


    // ========================================================
    // 3. LABOUR BASE TOTAL
    // ========================================================

    if (
        value === 0
    ) {

        value =
            getNumber(
                localStorage.getItem(
                    "labourBaseTotal"
                )
            );

    }


    // ========================================================
    // 4. GRAND TOTAL
    // ========================================================

    if (
        value === 0
    ) {

        value =
            getNumber(
                localStorage.getItem(
                    "grandTotal"
                )
            );

    }


    // ========================================================
    // 5. FINAL TOTAL
    // ========================================================

    if (
        value === 0
    ) {

        value =
            getNumber(
                localStorage.getItem(
                    "finalTotal"
                )
            );

    }


    // ========================================================
    // 6. CENTRAL BILL DATA
    // ========================================================

    if (
        value === 0 &&
        typeof getTotals ===
        "function"
    ) {

        try {

            const totals =
                getTotals();


            console.log(
                "CENTRAL TOTALS:",
                totals
            );


            if (
                totals &&
                totals.grandTotal !==
                undefined
            ) {

                value =
                    getNumber(
                        totals.grandTotal
                    );

            }

        }
        catch (error) {

            console.error(
                "CENTRAL TOTAL ERROR:",
                error
            );

        }

    }


    // ========================================================
    // FINAL VALUE
    // ========================================================

    currentGrandTotal =
        roundMoney(value);


    console.log(
        "CURRENT GRAND TOTAL:",
        currentGrandTotal
    );


    return currentGrandTotal;

}


// ============================================================
// DISPLAY CURRENT TOTAL
// ============================================================

function displayCurrentTotal() {

    if (
        currentTotalEl
    ) {

        currentTotalEl.textContent =
            formatMoney(
                currentGrandTotal
            );

    }

}


// ============================================================
// GET SELECTED DISCOUNT OPTION
// ============================================================

function getDiscountOption() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    if (
        !selected
    ) {

        return "no";

    }


    return selected.value;

}


// ============================================================
// SHOW / HIDE DISCOUNT SECTION
// ============================================================

function updateDiscountSection() {

    const option =
        getDiscountOption();


    if (
        discountSection
    ) {

        if (
            option === "yes"
        ) {

            discountSection.style.display =
                "block";

        }
        else {

            discountSection.style.display =
                "none";

        }

    }


    // ========================================================
    // NO DISCOUNT
    // ========================================================

    if (
        option === "no"
    ) {

        discountAmount =
            0;


        newGrandTotal =
            currentGrandTotal;


        if (
            discountAmountEl
        ) {

            discountAmountEl.value =
                "";

        }


        if (
            newGrandTotalEl
        ) {

            newGrandTotalEl.textContent =
                formatMoney(
                    newGrandTotal
                );

        }


        saveDiscountData();

    }


    // ========================================================
    // YES DISCOUNT
    // ========================================================

    if (
        option === "yes"
    ) {

        calculateDiscount();

    }


    printDiscountData();

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================
//
// New Grand Total =
// Current Grand Total - Discount
//
// ============================================================

function calculateDiscount() {

    // --------------------------------------------------------
    // CURRENT TOTAL
    // --------------------------------------------------------

    currentGrandTotal =
        getCurrentGrandTotal();


    // --------------------------------------------------------
    // DISCOUNT
    // --------------------------------------------------------

    discountAmount =
        roundMoney(
            discountAmountEl
                ? discountAmountEl.value
                : 0
        );


    // ========================================================
    // NO DISCOUNT
    // ========================================================

    if (
        getDiscountOption() === "no"
    ) {

        discountAmount =
            0;

        newGrandTotal =
            currentGrandTotal;

    }


    // ========================================================
    // DISCOUNT CANNOT BE NEGATIVE
    // ========================================================

    if (
        discountAmount < 0
    ) {

        discountAmount =
            0;

    }


    // ========================================================
    // DISCOUNT CANNOT BE GREATER THAN TOTAL
    // ========================================================

    if (
        discountAmount >
        currentGrandTotal
    ) {

        discountAmount =
            currentGrandTotal;


        if (
            discountAmountEl
        ) {

            discountAmountEl.value =
                currentGrandTotal;

        }


        console.warn(
            "Discount cannot be greater than Grand Total."
        );

    }


    // ========================================================
    // FINAL CALCULATION
    // ========================================================

    newGrandTotal =
        roundMoney(
            currentGrandTotal -
            discountAmount
        );


    // ========================================================
    // DISPLAY
    // ========================================================

    if (
        newGrandTotalEl
    ) {

        newGrandTotalEl.textContent =
            formatMoney(
                newGrandTotal
            );

    }


    // ========================================================
    // CONSOLE
    // ========================================================

    console.log(
        "----------------------------------------"
    );

    console.log(
        "DISCOUNT CALCULATION"
    );

    console.log(
        "CURRENT GRAND TOTAL:",
        currentGrandTotal
    );

    console.log(
        "DISCOUNT:",
        discountAmount
    );

    console.log(
        "NEW GRAND TOTAL:",
        newGrandTotal
    );

    console.log(
        "----------------------------------------"
    );


    // ========================================================
    // SAVE
    // ========================================================

    saveDiscountData();


    return newGrandTotal;

}


// ============================================================
// SAVE DISCOUNT DATA
// ============================================================

function saveDiscountData() {

    const option =
        getDiscountOption();


    const data = {

        option:
            option,

        currentGrandTotal:
            roundMoney(
                currentGrandTotal
            ),

        discountAmount:
            roundMoney(
                discountAmount
            ),

        newGrandTotal:
            roundMoney(
                newGrandTotal
            )

    };


    // ========================================================
    // OLD / COMPATIBILITY STORAGE
    // ========================================================

    localStorage.setItem(
        "discountData",
        JSON.stringify(data)
    );


    localStorage.setItem(
        "discountAmount",
        String(
            roundMoney(
                discountAmount
            )
        )
    );


    localStorage.setItem(
        "discountApplied",
        option === "yes"
            ? "true"
            : "false"
    );


    localStorage.setItem(
        "finalGrandTotal",
        String(
            roundMoney(
                newGrandTotal
            )
        )
    );


    // ========================================================
    // CENTRAL STORE
    // ========================================================

    if (
        typeof savePageData ===
        "function"
    ) {

        savePageData(
            "discount",
            data
        );

    }


    // ========================================================
    // SAVE TOTALS
    // ========================================================

    if (
        typeof saveTotals ===
        "function"
    ) {

        const oldTotals =
            typeof getTotals ===
            "function"
                ? getTotals()
                : {};


        saveTotals({

            ...oldTotals,

            currentGrandTotal:
                roundMoney(
                    currentGrandTotal
                ),

            discount:
                roundMoney(
                    discountAmount
                ),

            grandTotal:
                roundMoney(
                    newGrandTotal
                ),

            finalGrandTotal:
                roundMoney(
                    newGrandTotal
                )

        });

    }


    console.log(
        "DISCOUNT DATA SAVED:",
        data
    );

}


// ============================================================
// LOAD DISCOUNT DATA
// ============================================================

function loadDiscountData() {

    let data = null;


    // ========================================================
    // CENTRAL STORE FIRST
    // ========================================================

    if (
        typeof getPageData ===
        "function"
    ) {

        try {

            const centralData =
                getPageData(
                    "discount"
                );


            if (
                centralData &&
                Object.keys(
                    centralData
                ).length > 0
            ) {

                data =
                    centralData;

            }

        }
        catch (error) {

            console.error(
                "CENTRAL DISCOUNT LOAD ERROR:",
                error
            );

        }

    }


    // ========================================================
    // OLD STORAGE FALLBACK
    // ========================================================

    if (
        !data
    ) {

        const saved =
            localStorage.getItem(
                "discountData"
            );


        if (
            saved
        ) {

            try {

                data =
                    JSON.parse(
                        saved
                    );

            }
            catch (error) {

                console.error(
                    "DISCOUNT DATA LOAD ERROR:",
                    error
                );

            }

        }

    }


    if (
        !data
    ) {

        console.log(
            "NO PREVIOUS DISCOUNT DATA"
        );

        return;

    }


    console.log(
        "LOADED DISCOUNT DATA:",
        data
    );


    // ========================================================
    // RESTORE OPTION
    // ========================================================

    if (
        data.option
    ) {

        const radio =
            document.querySelector(
                `input[name="discountOption"][value="${data.option}"]`
            );


        if (
            radio
        ) {

            radio.checked =
                true;

        }

    }


    // ========================================================
    // RESTORE DISCOUNT
    // ========================================================

    if (
        discountAmountEl &&
        data.discountAmount !==
        undefined
    ) {

        discountAmountEl.value =
            data.discountAmount;

    }


    // ========================================================
    // RESTORE FINAL TOTAL
    // ========================================================

    if (
        data.newGrandTotal !==
        undefined
    ) {

        newGrandTotal =
            roundMoney(
                data.newGrandTotal
            );

    }


    // ========================================================
    // UPDATE SECTION
    // ========================================================

    const option =
        getDiscountOption();


    if (
        option === "yes"
    ) {

        if (
            discountSection
        ) {

            discountSection.style.display =
                "block";

        }

        calculateDiscount();

    }
    else {

        if (
            discountSection
        ) {

            discountSection.style.display =
                "none";

        }

        discountAmount =
            0;

        newGrandTotal =
            currentGrandTotal;


        if (
            newGrandTotalEl
        ) {

            newGrandTotalEl.textContent =
                formatMoney(
                    newGrandTotal
                );

        }

    }

}


// ============================================================
// PRINT ALL DISCOUNT DATA
// ============================================================

function printDiscountData() {

    console.log(
        "========================================"
    );

    console.log(
        "          DISCOUNT PAGE DATA"
    );

    console.log(
        "========================================"
    );

    console.log(
        "Current Grand Total :",
        currentGrandTotal
    );

    console.log(
        "Discount Option     :",
        getDiscountOption()
    );

    console.log(
        "Discount Amount     :",
        discountAmount
    );

    console.log(
        "New Grand Total     :",
        newGrandTotal
    );

    console.log(
        "========================================"
    );


    // ========================================================
    // COMPLETE BILL DATA
    // ========================================================

    if (
        typeof getBillData ===
        "function"
    ) {

        console.log(
            "COMPLETE BILL DATA:"
        );

        console.log(
            getBillData()
        );

    }

    console.log(
        "========================================"
    );

}


// ============================================================
// DISCOUNT OPTION CHANGE
// ============================================================

discountOptions.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "DISCOUNT OPTION CHANGED:",
                    this.value
                );


                updateDiscountSection();

            }
        );

    }
);


// ============================================================
// DISCOUNT INPUT
// ============================================================
//
// Automatically calculates while typing.
//
// ============================================================

if (
    discountAmountEl
) {

    discountAmountEl.addEventListener(
        "input",
        function () {

            calculateDiscount();

        }
    );

}


// ============================================================
// CALCULATE BUTTON
// ============================================================
//
// Kept for your existing HTML.
// Calculation also happens automatically while typing.
//
// ============================================================

if (
    calculateDiscountBtn
) {

    calculateDiscountBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            calculateDiscount();

        }
    );

}


// ============================================================
// NEXT
//
// DISCOUNT → ADVANCE
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopImmediatePropagation();


            console.log(
                "NEXT CLICKED"
            );


            // ------------------------------------------------
            // Make sure latest discount is calculated
            // ------------------------------------------------

            if (
                getDiscountOption() ===
                "yes"
            ) {

                calculateDiscount();

            }
            else {

                discountAmount =
                    0;

                newGrandTotal =
                    currentGrandTotal;

                saveDiscountData();

            }


            // ------------------------------------------------
            // Print before leaving
            // ------------------------------------------------

            printDiscountData();


            console.log(
                "GOING TO ADVANCE.HTML"
            );


            // ------------------------------------------------
            // NEXT PAGE
            // ------------------------------------------------

            window.location.href =
                "./advance.html";

        }
    );

}


// ============================================================
// BACK
//
// DISCOUNT → PERSONAL
// ============================================================

if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopImmediatePropagation();


            console.log(
                "BACK CLICKED"
            );


            // Save current state

            if (
                getDiscountOption() ===
                "yes"
            ) {

                calculateDiscount();

            }
            else {

                discountAmount =
                    0;

                newGrandTotal =
                    currentGrandTotal;

                saveDiscountData();

            }


            console.log(
                "GOING TO PERSONAL.HTML"
            );


            window.location.href =
                "./personal.html";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeDiscountPage() {

    console.log(
        "========================================"
    );

    console.log(
        "DISCOUNT PAGE INITIALIZING"
    );

    console.log(
        "========================================"
    );


    // --------------------------------------------------------
    // GET CURRENT GRAND TOTAL
    // --------------------------------------------------------

    getCurrentGrandTotal();


    // --------------------------------------------------------
    // DISPLAY CURRENT TOTAL
    // --------------------------------------------------------

    displayCurrentTotal();


    // --------------------------------------------------------
    // LOAD PREVIOUS DISCOUNT
    // --------------------------------------------------------

    loadDiscountData();


    // --------------------------------------------------------
    // FINAL DISPLAY
    // --------------------------------------------------------

    displayCurrentTotal();


    // --------------------------------------------------------
    // PRINT EVERYTHING
    // --------------------------------------------------------

    printDiscountData();


    console.log(
        "DISCOUNT PAGE READY"
    );

}


// ============================================================
// START
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDiscountPage
    );

}
else {

    initializeDiscountPage();

}
