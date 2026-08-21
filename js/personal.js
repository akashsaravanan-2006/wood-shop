// ============================================================
// PERSONAL.JS
// ============================================================

console.log("PERSONAL JS LOADED");


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Personal page loaded"
        );


        // ====================================================
        // BUTTONS
        // ====================================================

        const nextBtn =
            document.getElementById(
                "nextBtn"
            );

        const backBtn =
            document.getElementById(
                "backBtn"
            );


        console.log(
            "Next button:",
            nextBtn
        );

        console.log(
            "Back button:",
            backBtn
        );


        // ====================================================
        // PERSONAL INPUTS
        // ====================================================

        const customerName =
            document.getElementById(
                "customerName"
            );

        const customerMobile =
            document.getElementById(
                "customerMobile"
            );

        const customerPlace =
            document.getElementById(
                "customerPlace"
            );


        console.log(
            "Customer Name:",
            customerName
        );

        console.log(
            "Customer Mobile:",
            customerMobile
        );

        console.log(
            "Customer Place:",
            customerPlace
        );


        // ====================================================
        // RESTORE PERSONAL DATA
        // ====================================================
        //
        // If user comes back from Discount to Personal,
        // restore the previously entered values.
        //
        // ====================================================

        if (
            typeof getPageData ===
            "function"
        ) {

            const personalData =
                getPageData(
                    "personal"
                );


            console.log(
                "PERSONAL DATA RESTORED:",
                personalData
            );


            if (
                customerName &&
                personalData.name !==
                undefined
            ) {

                customerName.value =
                    personalData.name;

            }


            if (
                customerMobile &&
                personalData.mobile !==
                undefined
            ) {

                customerMobile.value =
                    personalData.mobile;

            }


            if (
                customerPlace &&
                personalData.place !==
                undefined
            ) {

                customerPlace.value =
                    personalData.place;

            }

        }
        else {

            console.error(
                "storedata.js is not loaded before personal.js"
            );

        }


        // ====================================================
        // SAVE PERSONAL DATA
        // ====================================================

        function savePersonalData() {

            // ------------------------------------------------
            // Check storedata.js
            // ------------------------------------------------

            if (
                typeof savePageData !==
                "function"
            ) {

                console.error(
                    "savePageData() is not available."
                );

                return;

            }


            // ------------------------------------------------
            // Get values
            // ------------------------------------------------

            const name =
                customerName
                    ? customerName.value.trim()
                    : "";


            const mobile =
                customerMobile
                    ? customerMobile.value.trim()
                    : "";


            const place =
                customerPlace
                    ? customerPlace.value.trim()
                    : "";


            // ------------------------------------------------
            // Save into central bill storage
            // ------------------------------------------------

            savePageData(
                "personal",
                {
                    name:
                        name,

                    mobile:
                        mobile,

                    place:
                        place
                }
            );


            // ------------------------------------------------
            // Optional old storage compatibility
            // ------------------------------------------------

            localStorage.setItem(
                "personalData",
                JSON.stringify({
                    name:
                        name,

                    mobile:
                        mobile,

                    place:
                        place
                })
            );


            console.log(
                "PERSONAL DATA SAVED:",
                {
                    name,
                    mobile,
                    place
                }
            );


            // ------------------------------------------------
            // Debug complete bill
            // ------------------------------------------------

            if (
                typeof showBillData ===
                "function"
            ) {

                showBillData();

            }

        }


        // ====================================================
        // AUTO SAVE WHILE TYPING
        // ====================================================
        //
        // This means the values are saved immediately.
        // So even if the user refreshes the page, the values
        // can be restored.
        //
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


        if (
            customerMobile
        ) {

            customerMobile.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        if (
            customerPlace
        ) {

            customerPlace.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        // ====================================================
        // NEXT
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


                    // ----------------------------------------
                    // SAVE BEFORE LEAVING
                    // ----------------------------------------

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


                    // ----------------------------------------
                    // SAVE BEFORE GOING BACK
                    // ----------------------------------------

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
