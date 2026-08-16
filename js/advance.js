// =========================================
// Grand Total
// =========================================

const grand =
    Number(localStorage.getItem("finalTotal")) || 0;

document.getElementById("grandTotal").value =
    grand.toFixed(2);

// =========================================
// Payment Type
// =========================================

const paymentType =
    document.getElementsByName("paymentType");

const advanceSection =
    document.getElementById("advanceSection");

// Default (Ready Cash)
advanceSection.style.display = "none";

localStorage.setItem(
    "advanceAmount",
    grand.toFixed(2)
);

localStorage.setItem(
    "balanceAmount",
    "0.00"
);

paymentType.forEach(function (radio) {

    radio.addEventListener("change", function () {

        if (this.value === "advance") {

            advanceSection.style.display = "block";

            document.getElementById("advanceAmount").value = "";
            document.getElementById("balanceAmount").value = "";

        } else {

            advanceSection.style.display = "none";

            localStorage.setItem(
                "advanceAmount",
                grand.toFixed(2)
            );

            localStorage.setItem(
                "balanceAmount",
                "0.00"
            );
        }

    });

});

// =========================================
// Calculate
// =========================================

document.getElementById("calculateBtn").onclick = function () {

    let advance =
        Number(document.getElementById("advanceAmount").value) || 0;

    if (advance > grand) {

        alert("Advance cannot be greater than Grand Total");
        return;

    }

    let balance = grand - advance;

    document.getElementById("balanceAmount").value =
        balance.toFixed(2);

    localStorage.setItem(
        "advanceAmount",
        advance.toFixed(2)
    );

    localStorage.setItem(
        "balanceAmount",
        balance.toFixed(2)
    );

};

// =========================================
// Next
// =========================================

document.getElementById("nextBtn").onclick = function () {

    const selected =
        document.querySelector('input[name="paymentType"]:checked').value;

    if (selected === "advance") {

        if (document.getElementById("balanceAmount").value === "") {

            alert("Please calculate the balance amount.");
            return;

        }

    }

    const advanceAmount =
        document.getElementById("advanceAmount").value || grand.toFixed(2);

    const balanceAmount =
        document.getElementById("balanceAmount").value || "0.00";

    localStorage.setItem("paymentType", selected);
    localStorage.setItem("advanceAmount", advanceAmount);
    localStorage.setItem("balanceAmount", balanceAmount);
    localStorage.setItem("grandTotal", grand.toFixed(2));

    window.location.href = "bill.html";

};// =======================================
// BACK BUTTON
// =======================================

const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "personal.html";
    });
}