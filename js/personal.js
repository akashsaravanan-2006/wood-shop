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

        const customerMobile =
            document.getElementById("customerMobile");

        const customerPlace =
            document.getElementById("customerPlace");


        // ====================================================
        // RESTORE DATA AFTER REFRESH
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


            const data =
                getPageData("personal");


            console.log(
                "PERSONAL DATA FOUND:",
                data
            );


            if (
                customerName &&
                data.name !== undefined
            ) {

                customerName.value =
                    data.name;

            }


            if (
                customerMobile &&
                data.mobile !== undefined
            ) {

                customerMobile.value =
                    data.mobile;

            }


            if (
                customerPlace &&
                data.place !== undefined
            ) {

                customerPlace.value =
                    data.place;

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
                    customerMobile
                        ? customerMobile.value.trim()
                        : "",

                place:
                    customerPlace
                        ? customerPlace.value.trim()
                        : ""

            };


            // ------------------------------------------------
            // SAVE TO CENTRAL BILL STORAGE
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
        // RESTORE FIRST
        // ====================================================

        restorePersonalData();


        // ====================================================
        // AUTO SAVE WHILE TYPING
        // ====================================================

        if (customerName) {

            customerName.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        if (customerMobile) {

            customerMobile.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        if (customerPlace) {

            customerPlace.addEventListener(
                "input",
                function () {

                    savePersonalData();

                }
            );

        }


        // ====================================================
        // NEXT
        // PERSONAL → DISCOUNT
        // ====================================================

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopImmediatePropagation();


                    // SAVE BEFORE LEAVING

                    savePersonalData();


                    console.log(
                        "PERSONAL → DISCOUNT"
                    );


                    window.location.href =
                        "./discount.html";

                }
            );

        }


        // ====================================================
        // BACK
        // PERSONAL → LABOUR
        // ====================================================

        if (backBtn) {

            backBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopImmediatePropagation();


                    // SAVE BEFORE LEAVING

                    savePersonalData();


                    console.log(
                        "PERSONAL → LABOUR"
                    );


                    window.location.href =
                        "./labour.html";

                }
            );

        }

    }
);
