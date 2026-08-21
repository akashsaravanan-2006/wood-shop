// ============================================================
// PERSONAL.JS
// FLOW:
// Personal -> Discount
// Back     -> Labour
// ============================================================

console.log("PERSONAL.JS VERSION 10001 LOADED");

document.addEventListener("DOMContentLoaded", function () {

    console.log("PERSONAL PAGE READY");

    // ========================================================
    // ELEMENTS
    // ========================================================

    const customerName = document.getElementById("customerName");
    const mobileNumber = document.getElementById("mobileNumber");
    const place = document.getElementById("place");

    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");


    // ========================================================
    // CHECK ELEMENTS
    // ========================================================

    if (!customerName || !mobileNumber || !place) {
        console.error("PERSONAL ERROR: Input element missing");
        return;
    }

    if (!nextBtn || !backBtn) {
        console.error("PERSONAL ERROR: Button element missing");
        return;
    }


    // ========================================================
    // LOAD SAVED DATA
    // ========================================================

    customerName.value =
        localStorage.getItem("customerName") || "";

    mobileNumber.value =
        localStorage.getItem("customerMobile") || "";

    place.value =
        localStorage.getItem("customerPlace") || "";


    console.log("Personal data loaded");


    // ========================================================
    // VALIDATION
    // ========================================================

    function validatePersonal() {

        const name = customerName.value.trim();
        const mobile = mobileNumber.value.trim();
        const customerPlace = place.value.trim();


        if (name === "") {

            alert("Please enter Customer Name");
            customerName.focus();

            return false;
        }


        if (mobile === "") {

            alert("Please enter Mobile Number");
            mobileNumber.focus();

            return false;
        }


        if (!/^[0-9]{10}$/.test(mobile)) {

            alert("Please enter a valid 10-digit Mobile Number");
            mobileNumber.focus();

            return false;
        }


        if (customerPlace === "") {

            alert("Please enter Place");
            place.focus();

            return false;
        }


        return true;
    }


    // ========================================================
    // SAVE PERSONAL DATA
    // ========================================================

    function savePersonalData() {

        const name = customerName.value.trim();
        const mobile = mobileNumber.value.trim();
        const customerPlace = place.value.trim();


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


        console.log("PERSONAL DATA SAVED");

        console.log({
            name: name,
            mobile: mobile,
            place: customerPlace
        });
    }


    // ========================================================
    // NEXT BUTTON
    //
    // PERSONAL -> DISCOUNT
    // ========================================================

    nextBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        console.log("--------------------------------");
        console.log("PERSONAL NEXT CLICKED");
        console.log("--------------------------------");


        // Validate
        if (!validatePersonal()) {

            console.log("PERSONAL VALIDATION FAILED");

            return;
        }


        // Save
        savePersonalData();


        console.log("PERSONAL DATA SAVED");
        console.log("REDIRECTING TO DISCOUNT.HTML");


        // ====================================================
        // ONLY REDIRECT
        // ====================================================

        window.location.href = "discount.html";

    });


    // ========================================================
    // BACK BUTTON
    //
    // PERSONAL -> LABOUR
    // ========================================================

    backBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();


        console.log("PERSONAL BACK CLICKED");
        console.log("REDIRECTING TO LABOUR.HTML");


        window.location.href = "labour.html";

    });


});
