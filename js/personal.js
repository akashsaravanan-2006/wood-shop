// ============================================================
// PERSONAL.JS
//
// PERSONAL PAGE
//
// FLOW:
//
// Wood
//   ↓
// Labour
//   ↓
// Personal
//   ↓
// Discount
//
// PERSONAL MUST NEVER GO DIRECTLY TO ADVANCE.
// ============================================================


console.log(
    "=========================================="
);

console.log(
    "PERSONAL.JS LOADED - VERSION 20"
);

console.log(
    "=========================================="
);


// ============================================================
// HTML ELEMENTS
// ============================================================

const customerName =
    document.getElementById(
        "customerName"
    );


const mobileNumber =
    document.getElementById(
        "mobileNumber"
    );


const place =
    document.getElementById(
        "place"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


// ============================================================
// DEBUG ELEMENTS
// ============================================================

console.log(
    "Customer Name:",
    customerName
);

console.log(
    "Mobile Number:",
    mobileNumber
);

console.log(
    "Place:",
    place
);

console.log(
    "Next Button:",
    nextBtn
);

console.log(
    "Back Button:",
    backBtn
);


// ============================================================
// VALIDATION
// ============================================================

function validateForm() {

    // --------------------------------------------
    // CUSTOMER NAME
    // --------------------------------------------

    if (!customerName) {

        console.error(
            "ERROR: customerName element not found"
        );

        return false;

    }


    // --------------------------------------------
    // MOBILE
    // --------------------------------------------

    if (!mobileNumber) {

        console.error(
            "ERROR: mobileNumber element not found"
        );

        return false;

    }


    // --------------------------------------------
    // PLACE
    // --------------------------------------------

    if (!place) {

        console.error(
            "ERROR: place element not found"
        );

        return false;

    }


    const name =
        customerName.value.trim();


    const mobile =
        mobileNumber.value.trim();


    const customerPlace =
        place.value.trim();


    // ========================================================
    // NAME VALIDATION
    // ========================================================

    if (name === "") {

        alert(
            "Please enter Customer Name"
        );

        customerName.focus();

        return false;

    }


    // ========================================================
    // MOBILE VALIDATION
    // ========================================================

    if (mobile === "") {

        alert(
            "Please enter Mobile Number"
        );

        mobileNumber.focus();

        return false;

    }


    if (!/^[0-9]{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit Mobile Number"
        );

        mobileNumber.focus();

        return false;

    }


    // ========================================================
    // PLACE VALIDATION
    // ========================================================

    if (customerPlace === "") {

        alert(
            "Please enter Place"
        );

        place.focus();

        return false;

    }


    return true;

}


// ============================================================
// SAVE PERSONAL DATA
// ============================================================

function savePersonalData() {

    const data = {

        name:
            customerName.value.trim(),

        mobile:
            mobileNumber.value.trim(),

        place:
            place.value.trim()

    };


    // ========================================================
    // CENTRAL BILL STORAGE
    // ========================================================

    if (
        typeof savePageData ===
        "function"
    ) {

        savePageData(
            "personal",
            data
        );

    }
    else {

        console.warn(
            "savePageData() not available"
        );

    }


    // ========================================================
    // OLD STORAGE
    //
    // Keep these because your existing bill
    // code may use them.
    // ========================================================

    localStorage.setItem(
        "customerName",
        data.name
    );


    localStorage.setItem(
        "customerMobile",
        data.mobile
    );


    localStorage.setItem(
        "customerPlace",
        data.place
    );


    console.log(
        "PERSONAL DATA SAVED:"
    );

    console.log(
        data
    );

}


// ============================================================
// LOAD SAVED PERSONAL DATA
// ============================================================

function loadPersonalData() {

    let data = null;


    // ========================================================
    // GET FROM CENTRAL STORAGE
    // ========================================================

    if (
        typeof getPageData ===
        "function"
    ) {

        data =
            getPageData(
                "personal"
            );

    }


    // ========================================================
    // FALLBACK TO OLD STORAGE
    // ========================================================

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        data = {

            name:
                localStorage.getItem(
                    "customerName"
                ) || "",

            mobile:
                localStorage.getItem(
                    "customerMobile"
                ) || "",

            place:
                localStorage.getItem(
                    "customerPlace"
                ) || ""

        };

    }


    // ========================================================
    // RESTORE NAME
    // ========================================================

    if (customerName) {

        customerName.value =
            data.name || "";

    }


    // ========================================================
    // RESTORE MOBILE
    // ========================================================

    if (mobileNumber) {

        mobileNumber.value =
            data.mobile || "";

    }


    // ========================================================
    // RESTORE PLACE
    // ========================================================

    if (place) {

        place.value =
            data.place || "";

    }


    console.log(
        "PERSONAL DATA LOADED:"
    );

    console.log(
        data
    );

}


// ============================================================
// NEXT BUTTON
//
// PERSONAL -> DISCOUNT
//
// THIS IS THE ONLY REDIRECT FROM PERSONAL NEXT.
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            // Prevent any default action

            event.preventDefault();


            // Prevent another click handler
            // from receiving this event.

            event.stopPropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "PERSONAL NEXT BUTTON CLICKED"
            );


            // ==================================================
            // VALIDATE
            // ==================================================

            if (
                !validateForm()
            ) {

                console.log(
                    "PERSONAL VALIDATION FAILED"
                );

                return;

            }


            // ==================================================
            // SAVE
            // ==================================================

            savePersonalData();


            console.log(
                "PERSONAL DATA SAVED"
            );


            // ==================================================
            // REDIRECT
            //
            // VERY IMPORTANT:
            //
            // Personal -> Discount
            //
            // NOT:
            // Personal -> Advance
            // ==================================================

            console.log(
                "REDIRECTING TO:"
            );

            console.log(
                "discount.html"
            );


            window.location.assign(
                "discount.html"
            );

        }
    );

}
else {

    console.error(
        "ERROR: nextBtn NOT FOUND"
    );

}


// ============================================================
// BACK BUTTON
//
// PERSONAL -> LABOUR
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "PERSONAL BACK BUTTON CLICKED"
            );


            window.location.assign(
                "labour.html"
            );

        }
    );

}
else {

    console.warn(
        "backBtn not found"
    );

}


// ============================================================
// PAGE LOAD
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            console.log(
                "PERSONAL PAGE INITIALIZED"
            );

            loadPersonalData();

        }
    );

}
else {

    loadPersonalData();

}


// ============================================================
// FINAL DEBUG
// ============================================================

console.log(
    "=========================================="
);

console.log(
    "PERSONAL.JS READY"
);

console.log(
    "PERSONAL NEXT DESTINATION = discount.html"
);

console.log(
    "=========================================="
);
