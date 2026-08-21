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
        // INPUTS
        // ====================================================

        const customerName =
            document.getElementById("customerName");

        const mobileNumber =
            document.getElementById("mobileNumber");

        const place =
            document.getElementById("place");


        // ====================================================
        // RESTORE DATA
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
            // NAME
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
            // MOBILE
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
        // SAVE DATA
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


            // Save to central store

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
        // VALIDATE PERSONAL DATA
        // ====================================================

        function validatePersonalData() {

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


            // =================================================
            // NAME VALIDATION
            // =================================================

            if (
                name === ""
            ) {

                alert(
                    "Please enter Customer Name."
                );


                if (
                    customerName
                ) {

                    customerName.focus();

                }


                return false;

            }


            // =================================================
            // MOBILE EMPTY
            // =================================================

            if (
                mobile === ""
            ) {

                alert(
                    "Please enter Mobile Number."
                );


                if (
                    mobileNumber
                ) {

                    mobileNumber.focus();

                }


                return false;

            }


            // =================================================
            // MOBILE ONLY DIGITS
            // =================================================

            if (
                !/^\d+$/.test(mobile)
            ) {

                alert(
                    "Mobile Number must contain only digits."
                );


                if (
                    mobileNumber
                ) {

                    mobileNumber.focus();

                }


                return false;

            }


            // =================================================
            // MOBILE EXACTLY 10 DIGITS
            // =================================================

            if (
                mobile.length !== 10
            ) {

                alert(
                    "Mobile Number must be exactly 10 digits."
                );


                if (
                    mobileNumber
                ) {

                    mobileNumber.focus();

                }


                return false;

            }


            // =================================================
            // PLACE VALIDATION
            // =================================================

            if (
                customerPlace === ""
            ) {

                alert(
                    "Please enter Place."
                );


                if (
                    place
                ) {

                    place.focus();

                }


                return false;

            }


            // =================================================
            // ALL VALID
            // =================================================

            return true;

        }


        // ====================================================
        // RESTORE FIRST
        // ====================================================

        restorePersonalData();


        // ====================================================
        // AUTO SAVE NAME
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
        // AUTO SAVE MOBILE
        // ====================================================

        if (
            mobileNumber
        ) {

            mobileNumber.addEventListener(
                "input",
                function () {

                    // Keep only numbers

                    this.value =
                        this.value.replace(
                            /\D/g,
                            ""
                        );


                    // Maximum 10 digits

                    if (
                        this.value.length >
                        10
                    ) {

                        this.value =
                            this.value.slice(
                                0,
                                10
                            );

                    }


                    savePersonalData();

                }
            );

        }


        // ====================================================
        // AUTO SAVE PLACE
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
        // PERSONAL → DISCOUNT
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
                    // VALIDATE FIRST
                    // ----------------------------------------

                    const isValid =
                        validatePersonalData();


                    if (
                        !isValid
                    ) {

                        console.log(
                            "PERSONAL DATA INVALID"
                        );


                        // IMPORTANT:
                        // Stay on this page.

                        return;

                    }


                    // ----------------------------------------
                    // SAVE VALID DATA
                    // ----------------------------------------

                    savePersonalData();


                    console.log(
                        "PERSONAL DATA VALID AND SAVED"
                    );


                    console.log(
                        "GOING TO DISCOUNT.HTML"
                    );


                    // ----------------------------------------
                    // GO NEXT
                    // ----------------------------------------

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
        // PERSONAL → LABOUR
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


                    // Save current values before going back

                    savePersonalData();


                    console.log(
                        "PERSONAL DATA SAVED"
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
