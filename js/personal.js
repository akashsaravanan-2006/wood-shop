console.log("PERSONAL TEST JS LOADED");

const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {

    nextBtn.onclick = function (event) {

        event.preventDefault();

        console.log("PERSONAL NEXT CLICKED");
        console.log("GOING TO DISCOUNT.HTML");

        window.location.href = "discount.html";

    };

} else {

    console.error("nextBtn NOT FOUND");

}
