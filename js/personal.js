// ============================================================
// PERSONAL.JS
// ============================================================

console.log("PERSONAL JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Personal page loaded");


        // ====================================================
        // BUTTONS
        // ====================================================

        const nextBtn =
            document.getElementById("nextBtn");

        const backBtn =
            document.getElementById("backBtn");


        // ====================================================
        // CUSTOMER INPUTS
        // ====================================================

        const customerName =
            document.getElementById("customerName");

        const mobileNumber =
            document.getElementById("mobileNumber");

        const place =
            document.getElementById("place");


        // ====================================================
        // RESTORE PERSONAL DATA
        // ====================================================

        function restorePersonalData() {

            if (
                typeof getPageData !==
                "function"
            ) {

                console.error(
                    "storedata.js is not loaded."
                );

                return;

            }


            const personalData =
                getPageData("personal");


            console.log(
                "PERSONAL DATA RESTORED:",
                personalData
            );


            // ------------------------------------------------
            // CUSTOMER NAME
            // ------------------------------------------------

            if (
                customerName &&
                personalData.name !==
                undefined
            ) {

                customerName.value =
                    personalData.name;

            }


            // ------------------------------------------------
            // MOBILE NUMBER
            // ------------------------------------------------

            if (
                mobileNumber &&
                personalData.mobile !==
                undefined
            ) {

                mobileNumber.value =
                    personalData.mobile;

            }


            // ------------------------------------------------
            // PLACE
            // ------------------------------------------------

            if (
                place &&
                personalData.place !==
                undefined
            ) {

                place.value =
                    personalData.place;

            }

        }


        // ====================================================
        // SAVE PERSONAL DATA
        // ====================================================

        function savePersonalData() {

            if (
                typeof savePageData !==
                "function"
            ) {

                console.error(
                    "savePageData() is not available."
                );

                return;

            }


            const personalData = {

                name:
                    customerName
                        ? customerName.value.trim()
                        : "",

                mobile:
                    mobileNumber
                        ? mobileNumber.value.trim()
                        : "",

                place:
                    place
                        ? place.value.trim()
                        : ""

            };


            // ------------------------------------------------
            // SAVE TO CENTRAL STORE
            // ------------------------------------------------

            savePageData(
                "personal",
                personalData
            );


            console.log(
                "PERSONAL DATA SAVED:",
                personalData
            );

        }


        // ====================================================
        // RESTORE DATA FIRST
        // ====================================================

        restorePersonalData();


        // ====================================================
        // AUTO SAVE - NAME
        // ====================================================

        if (
            customerName
        ) {

            customerName.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        // ====================================================
        // AUTO SAVE - MOBILE
        // ====================================================

        if (
            mobileNumber
        ) {

            mobileNumber.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        // ====================================================
        // AUTO SAVE - PLACE
        // ====================================================

        if (
            place
        ) {

            place.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        // ====================================================
        // NEXT
        //
        // PERSONAL -> DISCOUNT
        // ====================================================

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


                    // SAVE BEFORE LEAVING

                    savePersonalData();


                    console.log(
                        "PERSONAL DATA SAVED"
                    );


                    console.log(
                        "GOING TO DISCOUNT.HTML"
                    );


                    window.location.href =
                        "./discount.html";

                }
            );

        }
        else {

            console.error(
                "Next button not found!"
            );

        }


        // ====================================================
        // BACK
        //
        // PERSONAL -> LABOUR
        // ====================================================

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


                    // SAVE BEFORE GOING BACK

                    savePersonalData();


                    console.log(
                        "PERSONAL DATA SAVED"
                    );


                    console.log(
                        "GOING TO LABOUR.HTML"
                    );


                    window.location.href =
                        "./labour.html";

                }
            );

        }
        else {

            console.error(
                "Back button not found!"
            );

        }

    }
);
