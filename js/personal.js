console.log("PERSONAL JS - TEST VERSION LOADED");

document.addEventListener("DOMContentLoaded", function () {

    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    console.log("Personal page loaded");
    console.log("Next button:", nextBtn);
    console.log("Back button:", backBtn);


    // ==========================================
    // NEXT
    // PERSONAL -> DISCOUNT
    // ==========================================

    nextBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        console.log("NEXT CLICKED");
        console.log("GOING TO DISCOUNT.HTML");

        window.location.href = "./discount.html";

    });


    // ==========================================
    // BACK
    // PERSONAL -> LABOUR
    // ==========================================

    backBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        console.log("BACK CLICKED");
        console.log("GOING TO LABOUR.HTML");

        window.location.href = "./labour.html";

    });

});
