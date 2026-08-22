// ============================================================
// ADVANCE.JS
// FLOW:
// WOOD → LABOUR → PERSONAL → DISCOUNT → ADVANCE → BILL
// ============================================================

console.log("==========================================");
console.log("ADVANCE.JS LOADED");
console.log("==========================================");


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let grandTotal = 0;
let paymentType = "cash";
let paymentMode = "cash";
let paymentFlag = "1";

let advanceAmount = 0;
let balanceAmount = 0;


// ============================================================
// ELEMENTS
// ============================================================

const grandTotalInput =
    document.getElementById("grandTotal");

const advanceSection =
    document.getElementById("advanceSection");

const advanceAmountInput =
    document.getElementById("advanceAmount");

const balanceAmountInput =
    document.getElementById("balanceAmount");

const calculateBtn =
    document.getElementById("calculateBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// NUMBER
// ============================================================

function toNumber(value) {

    const number =
        parseFloat(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// ROUND MONEY
// ============================================================

function money(value) {

    return Math.round(
        (
            toNumber(value) +
            Number.EPSILON
        ) * 100
    ) / 100;
}


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// ============================================================
// GET DISCOUNT FINAL TOTAL
// ============================================================
//
// Priority:
//
// 1. discountData.newGrandTotal
// 2. discountData.finalGrandTotal
// 3. discountData.finalTotal
// 4. discountFinalTotal
// 5. finalGrandTotal
//
// ============================================================

function getDiscountFinalTotal() {

    console.log("------------------------------------------");
    console.log("READING FINAL TOTAL FROM DISCOUNT");
    console.log("------------------------------------------");


    let total = 0;


    // ========================================================
    // 1. CENTRAL STORE
    // ========================================================

    if (
        typeof getPageData ===
        "function"
    ) {

        try {

            const discountData =
                getPageData("discount");


            console.log(
                "CENTRAL DISCOUNT DATA:",
                discountData
            );


            if (
                discountData &&
                discountData.newGrandTotal !==
                undefined
            ) {

                total =
                    money(
                        discountData.newGrandTotal
                    );

            }


            if (
                total === 0 &&
                discountData &&
                discountData.finalGrandTotal !==
                undefined
            ) {

                total =
                    money(
                        discountData.finalGrandTotal
                    );

            }


            if (
                total === 0 &&
                discountData &&
                discountData.finalTotal !==
                undefined
            ) {

                total =
                    money(
                        discountData.finalTotal
                    );

            }

        }
        catch (error) {

            console.error(
                "CENTRAL DISCOUNT ERROR:",
                error
            );

        }

    }


    // ========================================================
    // 2. discountData LOCAL STORAGE
    // ========================================================

    if (
        total === 0
    ) {

        const discountDataText =
            localStorage.getItem(
                "discountData"
            );


        if (
            discountDataText
        ) {

            try {

                const discountData =
                    JSON.parse(
                        discountDataText
                    );


                console.log(
                    "LOCAL DISCOUNT DATA:",
                    discountData
                );


                if (
                    discountData &&
                    discountData.newGrandTotal !==
                    undefined
                ) {

                    total =
                        money(
                            discountData.newGrandTotal
                        );

                }


                if (
                    total === 0 &&
                    discountData &&
                    discountData.finalGrandTotal !==
                    undefined
                ) {

                    total =
                        money(
                            discountData.finalGrandTotal
                        );

                }


                if (
                    total === 0 &&
                    discountData &&
                    discountData.finalTotal !==
                    undefined
                ) {

                    total =
                        money(
                            discountData.finalTotal
                        );

                }

            }
            catch (error) {

                console.error(
                    "DISCOUNT JSON ERROR:",
                    error
                );

            }

        }

    }


    // ========================================================
    // 3. discountFinalTotal
    // ========================================================

    if (
        total === 0
    ) {

        total =
            money(
                localStorage.getItem(
                    "discountFinalTotal"
                )
            );

    }


    // ========================================================
    // 4. finalGrandTotal
    // ========================================================

    if (
        total === 0
    ) {

        total =
            money(
                localStorage.getItem(
                    "finalGrandTotal"
                )
            );

    }


    // ========================================================
    // FINAL RESULT
    // ========================================================

    grandTotal =
        money(total);


    console.log(
        "FINAL GRAND TOTAL FROM DISCOUNT:",
        grandTotal
    );


    return grandTotal;

}


// ============================================================
// DISPLAY GRAND TOTAL
// ============================================================

function displayGrandTotal() {

    if (
        !grandTotalInput
    ) {

        console.error(
            "grandTotal element not found"
        );

        return;

    }


    grandTotalInput.value =
        "₹ " +
        formatMoney(grandTotal);


    console.log(
        "GRAND TOTAL DISPLAY:",
        grandTotalInput.value
    );

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance() {

    if (
        !balanceAmountInput
    ) {

        console.error(
            "balanceAmount element not found"
        );

        return;

    }


    balanceAmountInput.value =
        "₹ " +
        formatMoney(balanceAmount);


    console.log(
        "BALANCE DISPLAY:",
        balanceAmountInput.value
    );

}


// ============================================================
// SHOW ADVANCE SECTION
// ============================================================

function showAdvanceSection() {

    if (
        advanceSection
    ) {

        advanceSection.style.display =
            "block";

    }

}


// ============================================================
// HIDE ADVANCE SECTION
// ============================================================

function hideAdvanceSection() {

    if (
        advanceSection
    ) {

        advanceSection.style.display =
            "none";

    }

}


// ============================================================
// CALCULATE BALANCE
// ============================================================
//
// Grand Total NEVER changes.
//
// Balance = Grand Total - Advance
//
// ============================================================

function calculateBalance() {

    console.log("------------------------------------------");
    console.log("CALCULATING ADVANCE");
    console.log("------------------------------------------");


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        paymentType === "cash"
    ) {

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;


        if (
            advanceAmountInput
        ) {

            advanceAmountInput.value =
                formatMoney(
                    advanceAmount
                );

        }


        displayBalance();


        console.log(
            "PAYMENT TYPE: READY CASH"
        );

        console.log(
            "GRAND TOTAL:",
            grandTotal
        );

        console.log(
            "ADVANCE:",
            advanceAmount
        );

        console.log(
            "BALANCE:",
            balanceAmount
        );


        return;

    }


    // ========================================================
    // ADVANCE PAYMENT
    // ========================================================

    advanceAmount =
        toNumber(
            advanceAmountInput
                ? advanceAmountInput.value
                : 0
        );


    advanceAmount =
        money(
            advanceAmount
        );


    // ========================================================
    // EMPTY / NEGATIVE
    // ========================================================

    if (
        advanceAmount < 0
    ) {

        advanceAmount =
            0;

    }


    // ========================================================
    // ADVANCE GREATER THAN GRAND TOTAL
    // ========================================================

    if (
        advanceAmount >
        grandTotal
    ) {

        alert(
            "Advance amount cannot be greater than Grand Total."
        );


        advanceAmount =
            grandTotal;


        if (
            advanceAmountInput
        ) {

            advanceAmountInput.value =
                formatMoney(
                    grandTotal
                );

        }

    }


    // ========================================================
    // BALANCE
    // ========================================================

    balanceAmount =
        money(
            grandTotal -
            advanceAmount
        );


    if (
        balanceAmount < 0
    ) {

        balanceAmount =
            0;

    }


    displayBalance();


    // ========================================================
    // CONSOLE
    // ========================================================

    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    console.log(
        "ADVANCE AMOUNT:",
        advanceAmount
    );

    console.log(
        "BALANCE:",
        balanceAmount
    );

}


// ============================================================
// PAYMENT TYPE
// ============================================================

function updatePaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (
        !selected
    ) {

        return;

    }


    paymentType =
        selected.value;


    console.log(
        "PAYMENT TYPE:",
        paymentType
    );


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        paymentType === "cash"
    ) {

        paymentFlag =
            "1";


        hideAdvanceSection();


        advanceAmount =
            grandTotal;


        balanceAmount =
            0;


        if (
            advanceAmountInput
        ) {

            advanceAmountInput.value =
                formatMoney(
                    grandTotal
                );

        }


        displayBalance();

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    else {

        paymentFlag =
            "0";


        showAdvanceSection();


        // Do NOT change Grand Total

        advanceAmount =
            0;


        balanceAmount =
            grandTotal;


        if (
            advanceAmountInput
        ) {

            advanceAmountInput.value =
                "";

        }


        displayBalance();

    }


    localStorage.setItem(
        "paymentType",
        paymentType
    );


    localStorage.setItem(
        "paymentFlag",
        paymentFlag
    );


    saveAdvanceData();

}


// ============================================================
// PAYMENT MODE
// ============================================================

function updatePaymentMode() {

    const selected =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    if (
        !selected
    ) {

        return;

    }


    paymentMode =
        selected.value;


    localStorage.setItem(
        "paymentMode",
        paymentMode
    );


    console.log(
        "PAYMENT MODE:",
        paymentMode
    );


    saveAdvanceData();

}


// ============================================================
// SAVE ADVANCE DATA
// ============================================================

function saveAdvanceData() {

    const data = {

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        paymentFlag:
            paymentFlag,

        grandTotal:
            money(
                grandTotal
            ),

        advanceAmount:
            money(
                advanceAmount
            ),

        balanceAmount:
            money(
                balanceAmount
            ),

        savedAt:
            new Date().toISOString()

    };


    // ========================================================
    // MAIN STORAGE
    // ========================================================

    localStorage.setItem(
        "advanceData",
        JSON.stringify(data)
    );


    // ========================================================
    // INDIVIDUAL STORAGE
    // ========================================================

    localStorage.setItem(
        "paymentType",
        paymentType
    );


    localStorage.setItem(
        "paymentMode",
        paymentMode
    );


    localStorage.setItem(
        "paymentFlag",
        paymentFlag
    );


    localStorage.setItem(
        "advanceAmount",
        money(
            advanceAmount
        ).toFixed(2)
    );


    localStorage.setItem(
        "balanceAmount",
        money(
            balanceAmount
        ).toFixed(2)
    );


    localStorage.setItem(
        "advanceGrandTotal",
        money(
            grandTotal
        ).toFixed(2)
    );


    // ========================================================
    // CENTRAL STORE
    // ========================================================

    if (
        typeof savePageData ===
        "function"
    ) {

        savePageData(
            "advance",
            data
        );

    }


    // ========================================================
    // CONSOLE
    // ========================================================

    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE DATA SAVED"
    );

    console.log(
        data
    );

    console.log(
        "=========================================="
    );

}


// ============================================================
// LOAD SAVED ADVANCE DATA
// ============================================================

function loadAdvanceData() {

    let data = null;


    // ========================================================
    // CENTRAL STORE
    // ========================================================

    if (
        typeof getPageData ===
        "function"
    ) {

        try {

            const centralData =
                getPageData(
                    "advance"
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
                "CENTRAL ADVANCE ERROR:",
                error
            );

        }

    }


    // ========================================================
    // LOCAL STORAGE FALLBACK
    // ========================================================

    if (
        !data
    ) {

        const saved =
            localStorage.getItem(
                "advanceData"
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
                    "ADVANCE DATA ERROR:",
                    error
                );

            }

        }

    }


    if (
        !data
    ) {

        console.log(
            "NO PREVIOUS ADVANCE DATA"
        );

        return;

    }


    console.log(
        "LOADED ADVANCE DATA:",
        data
    );


    // ========================================================
    // PAYMENT TYPE
    // ========================================================

    if (
        data.paymentType
    ) {

        paymentType =
            data.paymentType;


        const radio =
            document.querySelector(
                `input[name="paymentType"][value="${paymentType}"]`
            );


        if (
            radio
        ) {

            radio.checked =
                true;

        }

    }


    // ========================================================
    // PAYMENT MODE
    // ========================================================

    if (
        data.paymentMode
    ) {

        paymentMode =
            data.paymentMode;


        const radio =
            document.querySelector(
                `input[name="paymentMode"][value="${paymentMode}"]`
            );


        if (
            radio
        ) {

            radio.checked =
                true;

        }

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    if (
        data.advanceAmount !==
        undefined
    ) {

        advanceAmount =
            money(
                data.advanceAmount
            );

    }


    // ========================================================
    // BALANCE
    // ========================================================

    if (
        data.balanceAmount !==
        undefined
    ) {

        balanceAmount =
            money(
                data.balanceAmount
            );

    }

}


// ============================================================
// PRINT EVERYTHING
// ============================================================

function printAdvanceData() {

    console.log(
        "=========================================="
    );

    console.log(
        "          ADVANCE PAGE DATA"
    );

    console.log(
        "=========================================="
    );

    console.log(
        "Grand Total     :",
        grandTotal
    );

    console.log(
        "Payment Type    :",
        paymentType
    );

    console.log(
        "Payment Mode    :",
        paymentMode
    );

    console.log(
        "Payment Flag    :",
        paymentFlag
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
        "=========================================="
    );


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
        "=========================================="
    );

}


// ============================================================
// PAYMENT TYPE EVENTS
// ============================================================

document
    .querySelectorAll(
        'input[name="paymentType"]'
    )
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    updatePaymentType();

                    printAdvanceData();

                }
            );

        }
    );


// ============================================================
// PAYMENT MODE EVENTS
// ============================================================

document
    .querySelectorAll(
        'input[name="paymentMode"]'
    )
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    updatePaymentMode();

                    printAdvanceData();

                }
            );

        }
    );


// ============================================================
// ADVANCE INPUT
// ============================================================
//
// Automatically calculates while typing.
//
// ============================================================

if (
    advanceAmountInput
) {

    advanceAmountInput.addEventListener(
        "input",
        function () {

            if (
                paymentType !== "advance"
            ) {

                return;

            }


            calculateBalance();

            saveAdvanceData();

        }
    );

}


// ============================================================
// CALCULATE BUTTON
// ============================================================

if (
    calculateBtn
) {

    calculateBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "CALCULATE BUTTON CLICKED"
            );


            calculateBalance();

            saveAdvanceData();

            printAdvanceData();

        }
    );

}


// ============================================================
// NEXT
//
// ADVANCE → BILL
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "ADVANCE NEXT CLICKED"
            );


            // =================================================
            // CURRENT PAYMENT TYPE
            // =================================================

            const selected =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (
                selected
            ) {

                paymentType =
                    selected.value;

            }


            // =================================================
            // READY CASH
            // =================================================

            if (
                paymentType === "cash"
            ) {

                paymentFlag =
                    "1";


                advanceAmount =
                    grandTotal;


                balanceAmount =
                    0;

            }


            // =================================================
            // ADVANCE PAYMENT
            // =================================================

            else {

                paymentFlag =
                    "0";


                advanceAmount =
                    toNumber(
                        advanceAmountInput
                            ? advanceAmountInput.value
                            : 0
                    );


                advanceAmount =
                    money(
                        advanceAmount
                    );


                // ---------------------------------------------
                // EMPTY
                // ---------------------------------------------

                if (
                    advanceAmount <= 0
                ) {

                    alert(
                        "Please enter Advance Amount."
                    );


                    if (
                        advanceAmountInput
                    ) {

                        advanceAmountInput.focus();

                    }


                    return;

                }


                // ---------------------------------------------
                // TOO MUCH
                // ---------------------------------------------

                if (
                    advanceAmount >
                    grandTotal
                ) {

                    alert(
                        "Advance amount cannot be greater than Grand Total."
                    );


                    advanceAmountInput.focus();

                    return;

                }


                // ---------------------------------------------
                // BALANCE
                // ---------------------------------------------

                balanceAmount =
                    money(
                        grandTotal -
                        advanceAmount
                    );

            }


            // =================================================
            // PAYMENT MODE
            // =================================================

            const selectedMode =
                document.querySelector(
                    'input[name="paymentMode"]:checked'
                );


            if (
                selectedMode
            ) {

                paymentMode =
                    selectedMode.value;

            }


            // =================================================
            // SAVE
            // =================================================

            saveAdvanceData();


            // =================================================
            // PRINT
            // =================================================

            printAdvanceData();


            console.log(
                "FINAL GRAND TOTAL:",
                grandTotal
            );

            console.log(
                "FINAL ADVANCE:",
                advanceAmount
            );

            console.log(
                "FINAL BALANCE:",
                balanceAmount
            );


            // =================================================
            // GO BILL
            // =================================================

            console.log(
                "GOING TO BILL.HTML"
            );


            window.location.href =
                "bill.html";

        }
    );

}


// ============================================================
// BACK
//
// ADVANCE → DISCOUNT
// ============================================================

if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "ADVANCE BACK → DISCOUNT"
            );


            // Save before leaving

            saveAdvanceData();


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeAdvancePage() {

    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE INITIALIZING"
    );


    // ========================================================
    // GET FINAL TOTAL FROM DISCOUNT
    // ========================================================

    grandTotal =
        getDiscountFinalTotal();


    console.log(
        "GRAND TOTAL FROM DISCOUNT:",
        grandTotal
    );


    // ========================================================
    // DISPLAY GRAND TOTAL
    // ========================================================

    displayGrandTotal();


    // ========================================================
    // LOAD SAVED ADVANCE DATA
    // ========================================================

    loadAdvanceData();


    // ========================================================
    // RESTORE PAYMENT TYPE
    // ========================================================

    const selectedType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (
        selectedType
    ) {

        paymentType =
            selectedType.value;

    }


    // ========================================================
    // RESTORE PAYMENT MODE
    // ========================================================

    const selectedMode =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    if (
        selectedMode
    ) {

        paymentMode =
            selectedMode.value;

    }


    // ========================================================
    // DISPLAY CURRENT STATE
    // ========================================================

    if (
        paymentType === "advance"
    ) {

        paymentFlag =
            "0";


        showAdvanceSection();


        if (
            advanceAmount > 0
        ) {

            calculateBalance();

        }
        else {

            balanceAmount =
                grandTotal;

            displayBalance();

        }

    }
    else {

        paymentType =
            "cash";

        paymentFlag =
            "1";


        hideAdvanceSection();


        advanceAmount =
            grandTotal;


        balanceAmount =
            0;


        if (
            advanceAmountInput
        ) {

            advanceAmountInput.value =
                formatMoney(
                    grandTotal
                );

        }


        displayBalance();

    }


    // ========================================================
    // SAVE
    // ========================================================

    saveAdvanceData();


    // ========================================================
    // PRINT
    // ========================================================

    printAdvanceData();


    console.log(
        "ADVANCE PAGE READY"
    );

    console.log(
        "=========================================="
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
        initializeAdvancePage
    );

}
else {

    initializeAdvancePage();

}


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.calculateBalance =
    calculateBalance;

window.saveAdvanceData =
    saveAdvanceData;

window.printAdvanceData =
    printAdvanceData;


console.log(
    "ADVANCE.JS READY"
);
