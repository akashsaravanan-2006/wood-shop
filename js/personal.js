// ===========================================
// PERSONAL.JS
// CENTRAL BILL STORAGE VERSION
// ===========================================


// ===========================================
// GET HTML ELEMENTS
// ===========================================

const customerName =
    document.getElementById("customerName");

const mobileNumber =
    document.getElementById("mobileNumber");

const place =
    document.getElementById("place");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ===========================================
// CHECK STORE DATA
// ===========================================

if (
    typeof getPageData !== "function" ||
    typeof savePageData !== "function"
) {

    console.error(
        "ERROR: storedata.js is not loaded."
    );

}


// ===========================================
// LOAD SAVED PERSONAL DATA
// ===========================================

function loadPersonalData() {

    // Get personal data from central storage
    const personalData =
        getPageData("personal");


    console.log(
        "Loaded Personal Data:",
        personalData
    );


    // Customer Name
    if (
        customerName &&
        personalData.customerName !== undefined
    ) {

        customerName.value =
            personalData.customerName;

    }


    // Mobile Number
    if (
        mobileNumber &&
        personalData.customerMobile !== undefined
    ) {

        mobileNumber.value =
            personalData.customerMobile;

    }


    // Place
    if (
        place &&
        personalData.customerPlace !== undefined
    ) {

        place.value =
            personalData.customerPlace;

    }


    // Restore bill number if available
    if (
        personalData.billNo
    ) {

        localStorage.setItem(
            "billNo",
            personalData.billNo
        );

    }


    // Restore bill date if available
    if (
        personalData.billDate
    ) {

        localStorage.setItem(
            "billDate",
            personalData.billDate
        );

    }

}


// ===========================================
// SAVE PERSONAL DATA
// ===========================================

function savePersonalData() {

    const name =
        customerName
            ? customerName.value.trim()
            : "";

    const mobile =
        mobileNumber
            ? mobileNumber.value.trim()
            : "";

    const customerPlace =
        place
            ? place.value.trim()
            : "";


    // Get existing personal data
    const oldData =
        getPageData("personal");


    // Save into CENTRAL STORAGE
    savePageData(
        "personal",
        {

            // Customer details
            customerName:
                name,

            customerMobile:
                mobile,

            customerPlace:
                customerPlace,

            // Keep existing bill number
            billNo:
                oldData.billNo || "",

            // Keep existing bill date
            billDate:
                oldData.billDate || ""

        }
    );


    // Also keep these old keys
    // because your existing bill.js/cbill.js
    // may still use them.

    localStorage.setItem(
        "customerName",
        name
    );

    localStorage.setItem(
        "customerMobile",
        mobile
    );

    localStorage.setItem(
        "customerPlace",
        customerPlace
    );


    console.log(
        "Personal data saved:",
        getPageData("personal")
    );

}


// ===========================================
// VALIDATION
// ===========================================

function validateForm() {

    if (!customerName) {

        alert(
            "Customer Name field not found."
        );

        return false;

    }


    if (!mobileNumber) {

        alert(
            "Mobile Number field not found."
        );

        return false;

    }


    if (!place) {

        alert(
            "Place field not found."
        );

        return false;

    }


    const name =
        customerName.value.trim();

    const mobile =
        mobileNumber.value.trim();

    const customerPlace =
        place.value.trim();


    // =====================================
    // CUSTOMER NAME
    // =====================================

    if (name === "") {

        alert(
            "Please enter Customer Name."
        );

        customerName.focus();

        return false;

    }


    // =====================================
    // MOBILE
    // =====================================

    if (mobile === "") {

        alert(
            "Please enter Mobile Number."
        );

        mobileNumber.focus();

        return false;

    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit Mobile Number."
        );

        mobileNumber.focus();

        return false;

    }


    // =====================================
    // PLACE
    // =====================================

    if (customerPlace === "") {

        alert(
            "Please enter Place."
        );

        place.focus();

        return false;

    }


    return true;

}


// ===========================================
// SAVE DATA WHILE USER TYPES
// ===========================================

if (customerName) {

    customerName.addEventListener(
        "input",
        function () {

            savePersonalData();

        }
    );

}


if (mobileNumber) {

    mobileNumber.addEventListener(
        "input",
        function () {

            savePersonalData();

        }
    );

}


if (place) {

    place.addEventListener(
        "input",
        function () {

            savePersonalData();

        }
    );

}


// ===========================================
// NEXT BUTTON
// ===========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            // Validate
            if (!validateForm()) {

                return;

            }


            // Get values
            const name =
                customerName.value.trim();

            const mobile =
                mobileNumber.value.trim();

            const customerPlace =
                place.value.trim();


            // =================================
            // GET EXISTING PERSONAL DATA
            // =================================

            const oldData =
                getPageData("personal");


            // =================================
            // BILL NUMBER
            // =================================

            let billCount =
                Number(
                    localStorage.getItem(
                        "billCount"
                    )
                ) || 0;


            let billNo =
                oldData.billNo;


            // Create a new bill number
            // only if this bill doesn't
            // already have one.

            if (!billNo) {

                billNo =
                    "BILL-" +
                    String(
                        billCount + 1
                    ).padStart(
                        4,
                        "0"
                    );

            }


            // =================================
            // BILL DATE
            // =================================

            let billDate =
                oldData.billDate;


            if (!billDate) {

                const now =
                    new Date();


                const year =
                    now.getFullYear();

                const month =
                    String(
                        now.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    );

                const day =
                    String(
                        now.getDate()
                    ).padStart(
                        2,
                        "0"
                    );


                billDate =
                    `${year}-${month}-${day}`;

            }


            // =================================
            // SAVE PERSONAL DATA
            // =================================

            savePageData(
                "personal",
                {

                    customerName:
                        name,

                    customerMobile:
                        mobile,

                    customerPlace:
                        customerPlace,

                    billNo:
                        billNo,

                    billDate:
                        billDate

                }
            );


            // =================================
            // OLD STORAGE KEYS
            // Keep for compatibility
            // =================================

            localStorage.setItem(
                "customerName",
                name
            );

            localStorage.setItem(
                "customerMobile",
                mobile
            );

            localStorage.setItem(
                "customerPlace",
                customerPlace
            );

            localStorage.setItem(
                "billNo",
                billNo
            );

            localStorage.setItem(
                "billDate",
                billDate
            );


            // =================================
            // DEBUG
            // =================================

            console.log(
                "================================"
            );

            console.log(
                "PERSONAL DATA SAVED"
            );

            console.log(
                getPageData("personal")
            );

            console.log(
                "COMPLETE BILL DATA"
            );

            console.log(
                getBillData()
            );

            console.log(
                "================================"
            );


            // =================================
            // GO TO ADVANCE
            // =================================

            window.location.href =
                "discount.html";

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

            // Save before leaving
            savePersonalData();


            // Go back to Labour
            window.location.href =
                "labour.html";

        }
    );

}


// ===========================================
// INITIAL LOAD
// ===========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPersonalData();

    }
);
