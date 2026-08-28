/* =========================================================
   HISTORY.JS
   BILL HISTORY + DIRECT PDF DOWNLOAD
   ========================================================= */

"use strict";

const API_URL = "https://wood-shop-backend.vercel.app/api";

const historyBody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const homeBtn = document.getElementById("homeBtn");
const statusFilter = document.getElementById("statusFilter");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const totalBills = document.getElementById("totalBills");
const pendingBills = document.getElementById("pendingBills");
const finishedBills = document.getElementById("finishedBills");
const returnBills = document.getElementById("returnBills");
const resultCount = document.getElementById("resultCount");

let allBills = [];

function num(value) {
    if (value === null || value === undefined || value === "") return 0;
    const n = Number(String(value).replace(/,/g, "").replace(/[₹$]/g, "").trim());
    return Number.isFinite(n) ? n : 0;
}

function money(value) {
    return num(value);
}

function fmt(value) {
    return money(value).toFixed(2);
}

function esc(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function parseJSON(value, fallback = []) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return value;
    if (typeof value !== "string" || !value.trim()) return fallback;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function billId(bill) {
    return bill?.id ?? bill?.bill_id ?? bill?.billId ?? bill?._id ?? "";
}

function paymentType(bill) {
    return String(
        bill?.payment_type ??
        bill?.paymentType ??
        "-"
    ).trim().toUpperCase() || "-";
}

function paymentMode(bill) {
    const mode = String(
        bill?.payment_mode ??
        bill?.paymentMode ??
        ""
    ).trim().toUpperCase();

    return mode === "UPI" ? "UPI" : mode === "CASH" ? "CASH" : "-";
}

function customerName(bill) {
    return bill?.customer_name ?? bill?.customerName ?? bill?.customer ?? "-";
}

function customerMobile(bill) {
    return bill?.customer_mobile ?? bill?.customerMobile ?? bill?.mobile ?? "-";
}

function customerPlace(bill) {
    return bill?.customer_place ?? bill?.customerPlace ?? bill?.place ?? "-";
}

function grandTotal(bill) {
    return money(bill?.grand_total ?? bill?.grandTotal);
}

// Grand Total stored by the database is already reduced after each return.
// This helper is kept separate so the Return button always uses the CURRENT
// remaining amount and never allows a return after the total reaches zero.
function remainingGrandTotal(bill) {
    return Math.max(0, grandTotal(bill));
}

function advance(bill) {
    return money(bill?.advance_amount ?? bill?.advanceAmount);
}

function balance(bill) {
    return money(bill?.balance_amount ?? bill?.balanceAmount);
}

function returnAmount(bill) {
    return money(bill?.return_amount ?? bill?.returnAmount);
}

function woodTotal(bill) {
    return money(bill?.wood_total ?? bill?.woodTotal);
}

function labourCharge(bill) {
    return money(bill?.labour_charge ?? bill?.labourCharge);
}

function otherCharge(bill) {
    return money(bill?.other_charge ?? bill?.otherCharge);
}

function othersTotal(bill) {
    return money(bill?.others_total ?? bill?.othersTotal);
}

function discount(bill) {
    return money(
        bill?.discount_amount ??
        bill?.discountAmount ??
        bill?.discount
    );
}

function woodData(bill) {
    return parseJSON(bill?.wood_data ?? bill?.woodData ?? []);
}

function othersData(bill) {
    return parseJSON(bill?.others_data ?? bill?.othersData ?? []);
}

function dateText(value) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("en-IN");
}

function getStatus(bill) {
    const raw = String(
        bill?.status ??
        bill?.bill_status ??
        ""
    ).trim().toLowerCase();

    if (
        returnAmount(bill) > 0 ||
        raw === "return" ||
        raw === "returned"
    ) return "return";

    if (balance(bill) > 0 || raw === "pending") return "pending";

    return "finished";
}

function statusText(bill) {
    const s = getStatus(bill);
    return s === "return" ? "RETURNED" : s === "pending" ? "PENDING" : "DELIVERED";
}

function paymentHTML(mode) {
    if (mode === "UPI") return `<span class="payment-pill upi">UPI</span>`;
    if (mode === "CASH") return `<span class="payment-pill cash">CASH</span>`;
    return `<span class="payment-pill unknown">-</span>`;
}

function statusHTML(bill) {
    const s = getStatus(bill);
    return `<span class="status ${s}">${statusText(bill)}</span>`;
}

/* =========================================================
   LOAD HISTORY
   ========================================================= */

async function loadBills() {
    historyBody.innerHTML = `
        <tr><td colspan="15" class="loading-cell">Loading bills...</td></tr>
    `;

    try {
        const response = await fetch(`${API_URL}/bills`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            allBills = data;
        } else if (Array.isArray(data?.bills)) {
            allBills = data.bills;
        } else if (Array.isArray(data?.result)) {
            allBills = data.result;
        } else {
            throw new Error(data?.message || "Invalid bills response");
        }

        applyFilters();

    } catch (error) {
        console.error("HISTORY LOAD ERROR:", error);

        historyBody.innerHTML = `
            <tr>
                <td colspan="15" class="error-cell">
                    Unable to load bill history.<br>
                    <small>${esc(error.message)}</small>
                </td>
            </tr>
        `;

        updateSummary([]);
        updateResultCount(0);
    }
}

/* =========================================================
   DISPLAY
   ========================================================= */

function displayBills(bills) {
    historyBody.innerHTML = "";
    if (!Array.isArray(bills)) bills = [];

    updateSummary(bills);
    updateResultCount(bills.length);

    if (!bills.length) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="15" class="empty-cell">
                    <div style="font-size:32px">⌕</div>
                    No bills found<br>
                    <small>Try another search or filter.</small>
                </td>
            </tr>
        `;
        return;
    }

    bills.forEach((bill, index) => {
        const id = billId(bill);
        const no = bill?.bill_no ?? bill?.billNo ?? `BILL-${id}`;
        const cid = bill?.customer_id ?? bill?.customerId ?? "-";
        const gt = remainingGrandTotal(bill);
        const adv = advance(bill);
        const bal = balance(bill);
        const ret = returnAmount(bill);
        const status = getStatus(bill);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="bill-number">${esc(no)}</span></td>
            <td><span class="customer-id">${esc(cid)}</span></td>
            <td><span class="customer-name">${esc(customerName(bill))}</span></td>
            <td>${esc(customerMobile(bill))}</td>
            <td>${esc(customerPlace(bill))}</td>
            <td>${esc(dateText(
                bill?.bill_date ??
                bill?.billDate ??
                bill?.date ??
                bill?.created_at
            ))}</td>

            <!-- SEPARATE PAYMENT TYPE -->
            <td><span class="payment-type">${esc(paymentType(bill))}</span></td>

            <!-- SEPARATE PAYMENT MODE -->
            <td>${paymentHTML(paymentMode(bill))}</td>

            <td class="money">₹ ${fmt(gt)}</td>
            <td class="money">₹ ${fmt(adv)}</td>
            <td class="money ${bal > 0 ? "balance-due" : "balance-zero"}">
                ₹ ${fmt(bal)}
            </td>
            <td class="money">₹ ${fmt(ret)}</td>
            <td>${statusHTML(bill)}</td>

            <td>
                <div class="actions">
                    <button
                        type="button"
                        class="action-btn pdf-btn pdfBtn"
                        data-bill-id="${esc(id)}">
                        PDF
                    </button>

                    ${
                        gt > 0
                        ? `
                            <button
                                type="button"
                                class="action-btn return-btn returnBtn"
                                data-bill-id="${esc(id)}">
                                Return
                            </button>
                        `
                        : `
                            <button
                                type="button"
                                class="action-btn return-btn returnBtn"
                                data-bill-id="${esc(id)}"
                                disabled
                                title="Grand Total is already zero">
                                Returned
                            </button>
                        `
                    }
                </div>
            </td>
        `;

        historyBody.appendChild(row);
    });

    bindActions();
}

function updateSummary(bills) {
    let pending = 0;
    let finished = 0;
    let returned = 0;

    bills.forEach(bill => {
        const s = getStatus(bill);
        if (s === "pending") pending++;
        else if (s === "return") returned++;
        else finished++;
    });

    totalBills.textContent = bills.length;
    pendingBills.textContent = pending;
    finishedBills.textContent = finished;
    returnBills.textContent = returned;
}

function updateResultCount(count) {
    resultCount.textContent =
        `${count} ${count === 1 ? "bill" : "bills"}`;
}

/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function applyFilters() {
    const search = String(searchInput.value || "").trim().toLowerCase();
    const selected = String(statusFilter.value || "all").toLowerCase();

    const filtered = allBills.filter(bill => {
        const text = [
            bill?.bill_no,
            bill?.billNo,
            bill?.customer_id,
            bill?.customerId,
            customerName(bill),
            customerMobile(bill),
            customerPlace(bill),
            paymentType(bill),
            paymentMode(bill),
            statusText(bill)
        ].map(v => String(v ?? "").toLowerCase()).join(" ");

        return (
            (!search || text.includes(search)) &&
            (selected === "all" || getStatus(bill) === selected)
        );
    });

    displayBills(filtered);

    clearSearchBtn.classList.toggle("visible", Boolean(search));
}

function bindActions() {
    document.querySelectorAll(".pdfBtn").forEach(button => {
        button.addEventListener("click", () => {
            downloadBillPDF(button.dataset.billId, button);
        });
    });

    document.querySelectorAll(".returnBtn").forEach(button => {
        button.addEventListener("click", async () => {
            const bill = allBills.find(
                item => String(billId(item)) === String(button.dataset.billId)
            );

            if (bill) await handleReturn(bill);
        });
    });
}

/* =========================================================
   RETURN
   ========================================================= */

async function handleReturn(bill) {
    const id = billId(bill);
    const no = bill?.bill_no ?? bill?.billNo ?? `BILL-${id}`;
    const total = remainingGrandTotal(bill);

    if (total <= 0) {
        alert("This bill has already been fully returned. Grand Total is ₹ 0.00.");
        return;
    }

    const value = prompt(
        `Enter Return Amount\n\nBill No: ${no}\nGrand Total: ₹ ${fmt(total)}`
    );

    if (value === null) return;

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid return amount.");
        return;
    }

    if (amount > total) {
        alert("Return amount cannot be greater than Grand Total.");
        return;
    }

    if (!confirm(
        `Confirm return?\n\nBill: ${no}\nReturn: ₹ ${fmt(amount)}`
    )) return;

    try {
        const response = await fetch(
            `${API_URL}/return-bill`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    returnAmount: amount
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${await response.text()}`
            );
        }

        alert("Return saved successfully.");
        await loadBills();

    } catch (error) {
        console.error("RETURN ERROR:", error);
        alert("Return update failed.\n\n" + error.message);
    }
}

/* =========================================================
   PDF DATA HELPERS
   ========================================================= */

function woodRowsPDF(data) {
    if (!Array.isArray(data) || !data.length) {
        return `<tr><td colspan="7" style="text-align:center">No wood details</td></tr>`;
    }

    return data.map((item, i) => {
        let type = item?.woodType ?? item?.wood_type ?? "-";

        if (String(type).toLowerCase() === "other") {
            type = item?.otherWood ?? item?.other_wood ?? "Other";
        }

        const breadth =
            item?.breadth ??
            item?.breadthInch ??
            item?.breadth_inch ??
            "-";

        const thickness =
            item?.thickness ??
            item?.thicknessInch ??
            item?.thickness_inch ??
            "-";

        const cft = money(
            item?.cubicFeet ??
            item?.cubic_feet ??
            item?.cft
        );

        const amount = money(
            item?.amount ??
            item?.totalAmount ??
            item?.total_amount
        );

        let lengthText = "-";

        if (Array.isArray(item?.lengths)) {
            lengthText = item.lengths.map(x => {
                const length = num(x?.length ?? x?.feet);
                const extra = num(x?.extraLength ?? x?.extra_length);
                const qty = num(x?.qty ?? x?.quantity);
                return `${fmt(length + extra)} ft × ${qty}`;
            }).join("<br>");
        } else if (item?.length !== undefined) {
            const length = num(item.length);
            const extra = num(item?.extraLength ?? item?.extra_length);
            const qty = num(item?.qty ?? item?.quantity);
            lengthText = `${fmt(length + extra)} ft × ${qty}`;
        }

        return `
            <tr>
                <td>${i + 1}</td>
                <td>${esc(type)}</td>
                <td>${esc(breadth)}</td>
                <td>${esc(thickness)}</td>
                <td>${lengthText}</td>
                <td>${fmt(cft)}</td>
                <td>₹ ${fmt(amount)}</td>
            </tr>
        `;
    }).join("");
}

function otherRowsPDF(data, mainOther) {
    let rows = "";

    if (mainOther > 0) {
        rows += `
            <tr>
                <td>Other Charge</td>
                <td class="right">₹ ${fmt(mainOther)}</td>
            </tr>
        `;
    }

    if (Array.isArray(data)) {
        data.forEach(item => {
            if (!item) return;

            const name =
                item?.name ??
                item?.title ??
                item?.description ??
                item?.reason ??
                "Other";

            rows += `
                <tr>
                    <td>${esc(name)}</td>
                    <td class="right">₹ ${fmt(item?.amount)}</td>
                </tr>
            `;
        });
    }

    return rows || `
        <tr>
            <td>No Other Charges</td>
            <td class="right">₹ 0.00</td>
        </tr>
    `;
}

/* =========================================================
   PDF TEMPLATE
   ========================================================= */

function pdfHTML(bill) {
    const id = billId(bill);
    const no = bill?.bill_no ?? bill?.billNo ?? `BILL-${id}`;

    const date = dateText(
        bill?.bill_date ??
        bill?.billDate ??
        bill?.date ??
        bill?.created_at
    );

    const time =
        bill?.bill_time ??
        bill?.billTime ??
        "-";

    const cid =
        bill?.customer_id ??
        bill?.customerId ??
        "-";

    const totalCFT = money(
        bill?.total_cft ??
        bill?.totalCFT
    );

    const wood = woodTotal(bill);
    const labour = labourCharge(bill);
    const other = otherCharge(bill);
    const others = othersTotal(bill);
    const disc = discount(bill);
    const total = remainingGrandTotal(bill);
    const adv = advance(bill);
    const bal = balance(bill);
    const ret = returnAmount(bill);

    return `
    <div class="pdf-bill">
      <style>
        *{box-sizing:border-box}
        .pdf-bill{width:794px;min-height:1123px;padding:34px;background:#fff;color:#172033;
          font-family:Arial,Helvetica,sans-serif;font-size:12px}
        .pdf-head{text-align:center;border-bottom:2px solid #172033;padding-bottom:14px;margin-bottom:14px}
        .pdf-head h1{margin:0;font-size:23px}
        .pdf-head p{margin:4px 0;font-size:11px;color:#4b5563}
        .bill-no{display:flex;justify-content:space-between;background:#f1f5f9;border:1px solid #d5dbe5;
          padding:9px 11px;font-weight:700}
        .title{margin-top:14px;margin-bottom:7px;padding:7px 10px;background:#eef2f7;
          border-left:4px solid #2563eb;font-weight:800}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;border:1px solid #d5dbe5;padding:10px}
        .label{font-weight:700;color:#4b5563}
        .pay{display:flex;gap:10px;margin-top:8px}
        .pay div{flex:1;border:1px solid #d5dbe5;padding:8px}
        .pay strong{display:block;margin-bottom:3px}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #d5dbe5;padding:6px 7px;vertical-align:middle}
        th{background:#f1f5f9;text-align:left;font-weight:800}
        .right{text-align:right}
        .grand td{background:#eef6ff;font-size:14px;font-weight:900}
        .discount{color:#b91c1c}
        .footer{text-align:center;margin-top:22px;padding-top:12px;border-top:1px solid #d5dbe5;color:#6b7280}
      </style>

      <div class="pdf-head">
        <h1>ஸ்ரீ அம்மன் சாமில்</h1>
        <p>தேக்கு, வேம்பு, பூவரசு வியாபாரம்</p>
        <p>Mobile : 9443076409 , 9715050908</p>
        <p>GST : 33DLKPK5760D1Z5</p>
      </div>

      <div class="bill-no">
        <span>BILL NO: ${esc(no)}</span>
        <span>DATE: ${esc(date)}</span>
      </div>

      <div class="title">Customer Information</div>

      <div class="grid">
        <div><span class="label">Customer Name:</span> ${esc(customerName(bill))}</div>
        <div><span class="label">Mobile:</span> ${esc(customerMobile(bill))}</div>
        <div><span class="label">Place:</span> ${esc(customerPlace(bill))}</div>
        <div><span class="label">Customer ID:</span> ${esc(cid)}</div>
        <div><span class="label">Date:</span> ${esc(date)}</div>
        <div><span class="label">Time:</span> ${esc(time)}</div>
      </div>

      <div class="pay">
        <div><strong>Payment Type</strong>${esc(paymentType(bill))}</div>
        <div><strong>Payment Mode</strong>${esc(paymentMode(bill))}</div>
        <div><strong>Status</strong>${esc(statusText(bill))}</div>
      </div>

      <div class="title">Wood Details</div>

      <table>
        <thead>
          <tr>
            <th>S.No</th><th>Wood Type</th><th>Breadth</th><th>Thickness</th>
            <th>Length / Qty</th><th>CFT</th><th>Amount</th>
          </tr>
        </thead>
        <tbody>${woodRowsPDF(woodData(bill))}</tbody>
      </table>

      <div class="title">Wood Summary</div>
      <table>
        <tr><td>Total CFT</td><td class="right">${fmt(totalCFT)}</td></tr>
        <tr><td>Wood Total</td><td class="right">₹ ${fmt(wood)}</td></tr>
      </table>

      <div class="title">Labour & Other Charges</div>
      <table>
        <tr><td>Labour Charge</td><td class="right">₹ ${fmt(labour)}</td></tr>
        ${otherRowsPDF(othersData(bill), other)}
        <tr><td>Other Charges Total</td><td class="right">₹ ${fmt(others)}</td></tr>
      </table>

      <div class="title">Payment Summary</div>
      <table>
        <tr><td>Wood Total</td><td class="right">₹ ${fmt(wood)}</td></tr>
        <tr><td>Labour Charge</td><td class="right">₹ ${fmt(labour)}</td></tr>
        <tr><td>Other Charge</td><td class="right">₹ ${fmt(other)}</td></tr>
        <tr><td>Additional Others</td><td class="right">₹ ${fmt(others)}</td></tr>

        ${disc > 0 ? `
          <tr>
            <td>Discount</td>
            <td class="right discount">- ₹ ${fmt(disc)}</td>
          </tr>
        ` : ""}

        <tr class="grand">
          <td>Grand Total</td>
          <td class="right">₹ ${fmt(total)}</td>
        </tr>

        <tr><td>Advance</td><td class="right">₹ ${fmt(adv)}</td></tr>
        <tr><td>Balance</td><td class="right">₹ ${fmt(bal)}</td></tr>

        ${ret > 0 ? `
          <tr><td>Return Amount</td><td class="right">₹ ${fmt(ret)}</td></tr>
        ` : ""}
      </table>

      <div class="footer">Thank You</div>
    </div>
    `;
}

/* =========================================================
   DIRECT PDF DOWNLOAD
   NO window.open()
   NO window.print()
   ========================================================= */

async function downloadBillPDF(id, button) {
    const oldText = button?.textContent || "PDF";

    try {
        if (button) {
            button.disabled = true;
            button.textContent = "Creating...";
        }

        if (typeof window.html2pdf !== "function") {
            throw new Error("PDF library did not load. Check your internet connection.");
        }

        const response = await fetch(
            `${API_URL}/bill/${encodeURIComponent(id)}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(`Bill API HTTP ${response.status}`);
        }

        const result = await response.json();
        const bill = result?.bill ?? result?.data ?? result;

        if (!bill) throw new Error("Bill data not found.");

        const no = bill?.bill_no ?? bill?.billNo ?? `BILL-${id}`;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = pdfHTML(bill);

        /*
          IMPORTANT:
          This is added to the CURRENT page only.
          It does not open a print page.
        */
        wrapper.style.position = "fixed";
        wrapper.style.left = "0";
        wrapper.style.top = "0";
        wrapper.style.width = "794px";
        wrapper.style.background = "#fff";
        wrapper.style.zIndex = "-9999";
        wrapper.style.opacity = "0.01";
        wrapper.style.pointerEvents = "none";

        document.body.appendChild(wrapper);

        await new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        );

        await new Promise(resolve => setTimeout(resolve, 250));

        const safeName = String(no).replace(/[\\/:*?"<>|]/g, "_");

        await html2pdf()
            .set({
                margin: 8,
                filename: `${safeName}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794,
                    windowHeight: Math.max(1123, wrapper.scrollHeight)
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                    compress: true
                },
                pagebreak: {
                    mode: ["css", "legacy"]
                }
            })
            .from(wrapper)
            .save();

        wrapper.remove();

        console.log("PDF DOWNLOADED:", no);

    } catch (error) {
        console.error("PDF ERROR:", error);
        alert("Unable to create bill PDF.\n\n" + error.message);
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = oldText;
        }
    }
}

/* =========================================================
   EVENTS
   ========================================================= */

searchBtn?.addEventListener("click", applyFilters);

searchInput?.addEventListener("input", applyFilters);

searchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
    }
});

clearSearchBtn?.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
    searchInput.focus();
});

statusFilter?.addEventListener("change", applyFilters);

refreshBtn?.addEventListener("click", async () => {
    const oldText = refreshBtn.textContent;

    refreshBtn.disabled = true;
    refreshBtn.textContent = "↻ Loading...";

    searchInput.value = "";
    statusFilter.value = "all";

    try {
        await loadBills();
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = oldText;
    }
});

homeBtn?.addEventListener("click", () => {
    window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", loadBills);


==================== cbill.js ====================

// ============================================================
// CBILL.JS
// FINAL SAVED BILL
// SAME DATA LOGIC AS BILL.JS
//
// IMPORTANT:
// Bill number is NEVER generated here.
// Database-generated bill_no is displayed.
// ============================================================

console.clear();

console.log("==========================================");
console.log("              CBILL.JS LOADED");
console.log("==========================================");


// ============================================================
// API
// ============================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ============================================================
// ELEMENTS
// ============================================================

const billNoElement =
    document.getElementById("billNo");

const billDateElement =
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");

const woodTable =
    document.getElementById("woodTable");

const chargeTable =
    document.getElementById("chargeTable");

const woodTotalElement =
    document.getElementById("woodTotal");

const othersTotalElement =
    document.getElementById("othersTotal");

const subtotalAmountElement =
    document.getElementById("subtotalAmount");

const subtotalElement =
    document.getElementById("subtotal");

const discountRow =
    document.getElementById("discountRow");

const discountAmountElement =
    document.getElementById("discountAmount");

const grandTotalElement =
    document.getElementById("grandTotal");

const advanceRow =
    document.getElementById("advanceRow");

const advanceAmountElement =
    document.getElementById("advanceAmount");

const balanceAmountElement =
    document.getElementById("balanceAmount");

const cftSummary =
    document.getElementById("cftSummary");

const printBtn =
    document.getElementById("printBtn");

const homeBtn =
    document.getElementById("homeBtn");

const clearBtn =
    document.getElementById("clearBtn");


// ============================================================
// SAVED BILL ID
// ============================================================

const savedBillId =
    localStorage.getItem(
        "savedBillId"
    );


console.log(
    "SAVED BILL ID:",
    savedBillId
);


// ============================================================
// NUMBER HELPER
// ============================================================

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const number =
        parseFloat(
            String(value)
                .replace(/[₹,\s]/g, "")
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return (
        "₹ " +
        numberValue(value).toFixed(2)
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// SAFE JSON
// ============================================================

function parseJSON(
    value,
    fallback
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return fallback;

    }


    if (
        typeof value !== "string"
    ) {

        return value;

    }


    try {

        return JSON.parse(
            value
        );

    }
    catch (error) {

        console.error(
            "JSON ERROR:",
            error
        );

        return fallback;

    }

}


// ============================================================
// LOCAL BILL DATA
// SAME SOURCE USED BY BILL.JS
// ============================================================

function getLocalBillData() {

    let data = {};


    // --------------------------------------------------------
    // current_bill_data
    // --------------------------------------------------------

    try {

        data =
            JSON.parse(
                localStorage.getItem(
                    "current_bill_data"
                ) || "{}"
            );

    }
    catch (error) {

        console.error(
            "current_bill_data ERROR:",
            error
        );

        data = {};

    }


    return data || {};

}


// ============================================================
// LOCAL DATA
// ============================================================

const localBillData =
    getLocalBillData();


console.log(
    "LOCAL BILL DATA:",
    localBillData
);


// ============================================================
// LOCAL PERSONAL DATA
// ============================================================

const localPersonal =
    localBillData.personal ||
    {};


// ============================================================
// GET CUSTOMER FROM LOCAL STORAGE
// ============================================================

function getLocalCustomer() {

    let name =
        localPersonal.name ||
        localPersonal.customerName ||
        localStorage.getItem(
            "customerName"
        ) ||
        "";


    let mobile =
        localPersonal.mobile ||
        localPersonal.customerMobile ||
        localStorage.getItem(
            "customerMobile"
        ) ||
        "";


    let place =
        localPersonal.place ||
        localPersonal.customerPlace ||
        localStorage.getItem(
            "customerPlace"
        ) ||
        "";


    return {

        name:
            name,

        mobile:
            mobile,

        place:
            place

    };

}


// ============================================================
// GET DISCOUNT
// ============================================================

function getDiscount(
    bill
) {

    let discount = 0;


    // DATABASE
    if (
        bill.discount_amount !==
            undefined &&
        bill.discount_amount !==
            null &&
        bill.discount_amount !== ""
    ) {

        discount =
            numberValue(
                bill.discount_amount
            );

    }

    // DATABASE SECOND FIELD
    else if (
        bill.discount !==
            undefined &&
        bill.discount !==
            null &&
        bill.discount !== ""
    ) {

        discount =
            numberValue(
                bill.discount
            );

    }

    // LOCAL STORAGE
    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );

    }


    if (
        discount === 0
    ) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discount"
                )
            );

    }


    if (
        discount < 0
    ) {

        discount = 0;

    }


    return discount;

}


// ============================================================
// GET ADVANCE
// ============================================================

function getAdvanceAmount(
    bill
) {

    let advance = null;


    // DATABASE
    if (
        bill.advance_amount !==
            undefined &&
        bill.advance_amount !==
            null &&
        bill.advance_amount !== ""
    ) {

        advance =
            numberValue(
                bill.advance_amount
            );

    }

    // DATABASE SECOND FIELD
    else if (
        bill.advance !==
            undefined &&
        bill.advance !==
            null &&
        bill.advance !== ""
    ) {

        advance =
            numberValue(
                bill.advance
            );

    }


    // LOCAL STORAGE FALLBACK
    if (
        advance === null ||
        !Number.isFinite(
            advance
        )
    ) {

        advance =
            numberValue(
                localStorage.getItem(
                    "advanceAmount"
                )
            );

    }


    if (
        advance < 0
    ) {

        advance = 0;

    }


    return advance;

}


// ============================================================
// DATE
// ============================================================

function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return (

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

        + "/" +

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        + "/" +

        date.getFullYear()

    );

}


// ============================================================
// TIME
// ============================================================

function formatTime(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                true
        }
    );

}


// ============================================================
// LOAD BILL
// ============================================================

async function loadFinalBill() {

    console.log(
        "=========================================="
    );

    console.log(
        "STARTING CBILL"
    );

    console.log(
        "=========================================="
    );


    if (
        !savedBillId
    ) {

        console.error(
            "savedBillId is missing"
        );


        if (
            billNoElement
        ) {

            billNoElement.textContent =
                "---";

        }


        alert(
            "Saved bill ID is missing."
        );


        return;

    }


    try {

        // ====================================================
        // FETCH DATABASE BILL
        // ====================================================

        const response =
            await fetch(
                `${API_URL}/bill/${savedBillId}`
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // ====================================================
        // DATABASE RESPONSE
        // ====================================================

        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        const bill =
            result.bill ||
            result.data ||
            result;


        if (
            !bill
        ) {

            throw new Error(
                "Bill not found."
            );

        }


        console.log(
            "FINAL BILL OBJECT:",
            bill
        );


        // ====================================================
        // BILL NUMBER
        // ====================================================
        //
        // DO NOT GENERATE.
        //
        // Database-generated number only.
        //
        // ====================================================

        if (
            billNoElement
        ) {

            billNoElement.textContent =
                bill.bill_no ||
                "---";

        }


        if (
            bill.bill_no
        ) {

            localStorage.setItem(
                "savedBillNo",
                bill.bill_no
            );

        }


        // ====================================================
        // CUSTOMER
        // ====================================================
        //
        // FIRST DATABASE
        // THEN LOCAL BILL.JS DATA
        //
        // ====================================================

        const localCustomer =
            getLocalCustomer();


        const customerName =
            bill.customer_name ||
            bill.customerName ||
            localCustomer.name ||
            "-";


        const customerMobile =
            bill.customer_mobile ||
            bill.customerMobile ||
            localCustomer.mobile ||
            "-";


        const customerPlace =
            bill.customer_place ||
            bill.customerPlace ||
            localCustomer.place ||
            "-";


        console.log(
            "CUSTOMER FINAL:",
            customerName
        );

        console.log(
            "MOBILE FINAL:",
            customerMobile
        );

        console.log(
            "PLACE FINAL:",
            customerPlace
        );


        if (
            customerNameElement
        ) {

            customerNameElement.textContent =
                customerName;

        }


        if (
            customerMobileElement
        ) {

            customerMobileElement.textContent =
                customerMobile;

        }


        if (
            customerPlaceElement
        ) {

            customerPlaceElement.textContent =
                customerPlace;

        }


        // ====================================================
        // DATE
        // ====================================================

        const billDate =
            bill.bill_date ||
            bill.date ||
            bill.created_at;


        if (
            billDateElement
        ) {

            billDateElement.textContent =
                formatDate(
                    billDate
                );

        }


        // ====================================================
        // TIME
        // ====================================================

        const billTime =
            bill.bill_time ||
            bill.time ||
            bill.created_at;


        if (
            billDayTimeElement
        ) {

            billDayTimeElement.textContent =
                formatTime(
                    billTime
                );

        }


        // ====================================================
        // WOOD TOTAL
        // ====================================================

        const woodTotal =
            numberValue(
                bill.wood_total
            );


        // ====================================================
        // OTHER TOTAL
        // ====================================================

        const othersTotal =
            numberValue(
                bill.others_total
            );


        // ====================================================
        // SUBTOTAL
        // ====================================================

        const subtotal =
            woodTotal +
            othersTotal;


        // ====================================================
        // DISCOUNT
        // ====================================================

        const discount =
            getDiscount(
                bill
            );


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        let grandTotal =
            subtotal -
            discount;


        if (
            grandTotal < 0
        ) {

            grandTotal = 0;

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        let advanceAmount =
            getAdvanceAmount(
                bill
            );


        if (
            advanceAmount > grandTotal
        ) {

            advanceAmount =
                grandTotal;

        }


        // ====================================================
        // BALANCE
        // ====================================================

        let balanceAmount =
            grandTotal -
            advanceAmount;


        if (
            balanceAmount < 0
        ) {

            balanceAmount = 0;

        }


        // ====================================================
        // DISPLAY TOTALS
        // ====================================================

        if (
            woodTotalElement
        ) {

            woodTotalElement.textContent =
                money(
                    woodTotal
                );

        }


        if (
            othersTotalElement
        ) {

            othersTotalElement.textContent =
                money(
                    othersTotal
                );

        }


        if (
            subtotalAmountElement
        ) {

            subtotalAmountElement.textContent =
                money(
                    subtotal
                );

        }


        if (
            subtotalElement
        ) {

            subtotalElement.textContent =
                money(
                    subtotal
                );

        }


        // ====================================================
        // DISCOUNT
        // ====================================================

        if (
            discount > 0
        ) {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "flex";

            }


            if (
                discountAmountElement
            ) {

                discountAmountElement.textContent =
                    "- " +
                    money(
                        discount
                    );

            }

        }
        else {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "none";

            }

        }


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        if (
            grandTotalElement
        ) {

            grandTotalElement.textContent =
                money(
                    grandTotal
                );

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        if (
            advanceAmountElement
        ) {

            advanceAmountElement.textContent =
                money(
                    advanceAmount
                );

        }


        if (
            advanceRow
        ) {

            advanceRow.style.display =
                advanceAmount > 0
                    ? "flex"
                    : "none";

        }


        // ====================================================
        // BALANCE
        // ====================================================

        if (
            balanceAmountElement
        ) {

            balanceAmountElement.textContent =
                money(
                    balanceAmount
                );

        }


        // ====================================================
        // WOOD DATA
        // ====================================================

        let woodData =
            bill.wood_data;


        if (
            typeof woodData ===
            "string"
        ) {

            woodData =
                parseJSON(
                    woodData,
                    []
                );

        }


        if (
            !Array.isArray(
                woodData
            )
        ) {

            woodData = [];

        }


        // ====================================================
        // FALLBACK TO LOCAL BILL DATA
        // SAME AS BILL.JS
        // ====================================================

        if (
            woodData.length === 0
        ) {

            const localWood =
                localBillData.wood ||
                {};


            if (
                Array.isArray(
                    localWood.calculations
                )
            ) {

                woodData =
                    localWood.calculations;

            }

        }


        console.log(
            "WOOD DATA:",
            woodData
        );


        console.log(
            "WOOD COUNT:",
            woodData.length
        );


        console.table(
            woodData
        );


        // ====================================================
        // DISPLAY WOOD
        // ====================================================

        loadWoodData(
            woodData
        );


        // ====================================================
        // OTHER CHARGES
        // ====================================================

        let othersData =
            bill.others_data;


        if (
            typeof othersData ===
            "string"
        ) {

            othersData =
                parseJSON(
                    othersData,
                    []
                );

        }


        if (
            !Array.isArray(
                othersData
            )
        ) {

            othersData = [];

        }


        // ====================================================
        // FALLBACK TO LOCAL BILL.JS DATA
        // ====================================================

        if (
            othersData.length === 0
        ) {

            const localLabour =
                localBillData.labour ||
                {};


            const localOthers =
                localBillData.others ||
                localBillData.otherCharges ||
                [];


            // ------------------------------------------------
            // CREATE CHARGES FROM BILL.JS DATA
            // ------------------------------------------------

            if (
                Array.isArray(
                    localOthers
                )
            ) {

                othersData =
                    localOthers;

            }


            // ------------------------------------------------
            // IF LABOUR DATA EXISTS
            // ------------------------------------------------

            if (
                Array.isArray(
                    localLabour.charges
                )
            ) {

                othersData =
                    localLabour.charges;

            }

        }


        console.log(
            "OTHER CHARGES DATA:",
            othersData
        );


        console.table(
            othersData
        );


        // ====================================================
        // DISPLAY OTHER CHARGES
        // ====================================================

        loadOtherCharges(
            bill,
            othersData
        );


        // ====================================================
        // CFT
        // ====================================================

        loadCftSummary(
            woodData
        );


        // ====================================================
        // SAVE TOTALS
        // ====================================================

        localStorage.setItem(
            "grandTotal",
            String(
                grandTotal
            )
        );


        localStorage.setItem(
            "finalTotal",
            String(
                grandTotal
            )
        );


        localStorage.setItem(
            "balanceAmount",
            String(
                balanceAmount
            )
        );


        // ====================================================
        // DEBUG SUMMARY
        // ====================================================

        console.log(
            "=========================================="
        );

        console.log(
            "FINAL CBILL SUMMARY"
        );

        console.log(
            "Bill No:",
            bill.bill_no
        );

        console.log(
            "Customer:",
            customerName
        );

        console.log(
            "Mobile:",
            customerMobile
        );

        console.log(
            "Place:",
            customerPlace
        );

        console.log(
            "Wood Total:",
            woodTotal
        );

        console.log(
            "Others Total:",
            othersTotal
        );

        console.log(
            "Subtotal:",
            subtotal
        );

        console.log(
            "Discount:",
            discount
        );

        console.log(
            "Grand Total:",
            grandTotal
        );

        console.log(
            "Advance:",
            advanceAmount
        );

        console.log(
            "Balance:",
            balanceAmount
        );

        console.log(
            "Wood Calculations:",
            woodData.length
        );

        console.log(
            "Other Charges:",
            othersData.length
        );

        console.log(
            "=========================================="
        );

    }

    catch (error) {

        console.error(
            "=========================================="
        );

        console.error(
            "CBILL ERROR:",
            error
        );

        console.error(
            "=========================================="
        );


        alert(
            "Unable to load final bill."
        );

    }

}


// ============================================================
// LOAD WOOD DATA
// ============================================================
//
// ONE CALCULATION = ONE ROW
//
// Length example:
//
// 9 → 4
// 5 → 6
//
// ============================================================

function loadWoodData(
    woodData
) {

    if (
        !woodTable
    ) {

        console.error(
            "woodTable not found."
        );

        return;

    }


    woodTable.innerHTML =
        "";


    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    No wood data
                </td>

            </tr>

        `;

        return;

    }


    let sno = 1;


    woodData.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

                return;

            }


            // =================================================
            // WOOD NAME
            // =================================================

            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "";


            if (
                woodName ===
                "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            if (
                !woodName
            ) {

                woodName =
                    "-";

            }


            // =================================================
            // SIZE
            // =================================================

            const breadth =
                numberValue(
                    item.breadth
                );


            const thickness =
                numberValue(
                    item.thickness
                );


            let size =
                "-";


            if (
                breadth > 0 &&
                thickness > 0
            ) {

                size =
                    `${breadth} × ${thickness}`;

            }
            else if (
                breadth > 0
            ) {

                size =
                    String(
                        breadth
                    );

            }
            else if (
                thickness > 0
            ) {

                size =
                    String(
                        thickness
                    );

            }


            // =================================================
            // QUALITY
            // =================================================

            const quality =
                item.quality !==
                    undefined &&
                item.quality !== ""
                    ? item.quality
                    : "-";


            // =================================================
            // PIECES
            // =================================================

            const pieces =
                Array.isArray(
                    item.pieces
                )
                    ? item.pieces
                    : [];


            // =================================================
            // LENGTH VALUES
            // =================================================

            let lengthValues =
                [];


            pieces.forEach(
                function (
                    piece
                ) {

                    if (
                        !piece
                    ) {

                        return;

                    }


                    const length =
                        numberValue(
                            piece.length
                        );


                    const extraLength =
                        numberValue(
                            piece.extraLength
                        );


                    const finalLength =
                        length +
                        extraLength;


                    const qty =
                        numberValue(
                            piece.qty
                        );


                    if (
                        finalLength > 0
                    ) {

                        lengthValues.push({

                            length:
                                finalLength,

                            qty:
                                qty

                        });

                    }

                }
            );


            // =================================================
            // DIRECT LENGTH FALLBACK
            // =================================================

            if (
                lengthValues.length === 0 &&
                item.length !==
                    undefined
            ) {

                const directLength =
                    numberValue(
                        item.length
                    );


                const directQty =
                    numberValue(
                        item.qty
                    );


                if (
                    directLength > 0
                ) {

                    lengthValues.push({

                        length:
                            directLength,

                        qty:
                            directQty

                    });

                }

            }


            // =================================================
            // LENGTH DISPLAY
            // =================================================

            let lengthText =
                "-";


            if (
                lengthValues.length > 0
            ) {

                lengthText =
                    lengthValues
                        .map(
                            function (
                                value
                            ) {

                                return (
                                    `${value.length} → ${value.qty}`
                                );

                            }
                        )
                        .join(
                            "<br>"
                        );

            }


            // =================================================
            // TOTAL QTY
            // =================================================

            let totalQty =
                0;


            pieces.forEach(
                function (
                    piece
                ) {

                    if (
                        !piece
                    ) {

                        return;

                    }


                    totalQty +=
                        numberValue(
                            piece.qty
                        );

                }
            );


            if (
                totalQty === 0 &&
                item.qty !==
                    undefined
            ) {

                totalQty =
                    numberValue(
                        item.qty
                    );

            }

            // =================================================
            // CFT
            // =================================================

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            // =================================================
            // RATE
            // =================================================

            const rate =
                numberValue(
                    item.rate
                );


            // =================================================
            // AMOUNT
            // =================================================

            const amount =
                numberValue(
                    item.amount
                );


            // =================================================
            // CREATE ROW
            // =================================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${sno}
                </td>

                <td>
                    ${escapeHTML(
                        woodName
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        size
                    )}
                </td>

                <td>
                    ${lengthText}
                </td>

                <td>
                    ${totalQty}
                </td>

                <td>
                    ${cubicFeet.toFixed(2)}
                </td>

                <td>
                    ${money(
                        rate
                    )}
                </td>

                <td>
                    ${money(
                        amount
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        quality
                    )}
                </td>

            `;


            woodTable.appendChild(
                row
            );


            console.log(
                "WOOD CALCULATION:",
                sno,
                {
                    wood:
                        woodName,

                    size:
                        size,

                    lengths:
                        lengthValues,

                    qty:
                        totalQty,

                    cft:
                        cubicFeet,

                    rate:
                        rate,

                    amount:
                        amount,

                    quality:
                        quality
                }
            );


            sno++;

        }
    );

}


// ============================================================
// LOAD OTHER CHARGES
// ============================================================
//
// IMPORTANT:
//
// Database charges are used first.
// If database does not contain charge details,
// bill.js local data is used.
//
// ============================================================

function loadOtherCharges(
    bill,
    othersData
) {

    if (
        !chargeTable
    ) {

        console.error(
            "chargeTable not found."
        );

        return;

    }


    chargeTable.innerHTML =
        "";


    let sno = 1;

    let hasCharge =
        false;


    // =================================================
    // LABOUR CHARGE
    // =================================================

    const labour =
        numberValue(
            bill.labour_charge
        );


    if (
        labour > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>

            <td>
                Labour Charge
            </td>

            <td>
                ${money(
                    labour
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // =================================================
    // OTHER CHARGE
    // =================================================

    const otherCharge =
        numberValue(
            bill.other_charge
        );


    if (
        otherCharge > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>

            <td>
                Other Charge
            </td>

            <td>
                ${money(
                    otherCharge
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // =================================================
    // ADDITIONAL CHARGES
    // =================================================

    if (
        Array.isArray(
            othersData
        )
    ) {

        othersData.forEach(
            function (
                item
            ) {

                if (
                    !item
                ) {

                    return;

                }


                const amount =
                    numberValue(
                        item.amount ||
                        item.charge ||
                        item.value
                    );


                if (
                    amount <= 0
                ) {

                    return;

                }


                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";


                hasCharge =
                    true;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${sno++}
                    </td>

                    <td>
                        ${escapeHTML(
                            name
                        )}
                    </td>

                    <td>
                        ${money(
                            amount
                        )}
                    </td>

                `;


                chargeTable.appendChild(
                    row
                );

            }
        );

    }


    // =================================================
    // IF NO CHARGE
    // =================================================

    if (
        !hasCharge
    ) {

        chargeTable.innerHTML = `

            <tr>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

            </tr>

        `;

    }


    console.log(
        "OTHER CHARGES DISPLAYED:",
        hasCharge
    );

}


// ============================================================
// CFT SUMMARY
// ============================================================
//
// SAME WOOD + SAME QUALITY ARE COMBINED
//
// ============================================================

function loadCftSummary(
    woodData
) {

    if (
        !cftSummary
    ) {

        return;

    }


    cftSummary.innerHTML =
        "";


    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        cftSummary.innerHTML =
            "<p>-</p>";

        return;

    }


    // ========================================================
    // GROUP SAME WOOD + SAME QUALITY
    // ========================================================
    //
    // Example:
    //
    // Teak quality 2 = 3.65 CFT
    // Teak quality 2 = 8.00 CFT
    //
    // Result:
    // Teak (2) = 11.65 CFT
    //
    // ========================================================

    const grouped =
        new Map();


    woodData.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

                return;

            }


            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "-";


            if (
                woodName ===
                "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            const quality =
                item.quality !==
                    undefined &&
                item.quality !== ""
                    ? String(item.quality)
                    : "-";


            const cft =
                numberValue(
                    item.cubicFeet
                );


            const key =
                `${String(woodName).trim().toLowerCase()}||${quality.trim().toLowerCase()}`;


            if (
                !grouped.has(
                    key
                )
            ) {

                grouped.set(
                    key,
                    {
                        wood:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0
                    }
                );

            }


            grouped.get(
                key
            ).cft += cft;

        }
    );


    // ========================================================
    // DISPLAY GROUPED CFT
    // ========================================================

    let index = 1;


    grouped.forEach(
        function (
            group
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cft-summary-row";


            row.style.display =
                "flex";

            row.style.justifyContent =
                "space-between";

            row.style.alignItems =
                "center";

            row.style.width =
                "100%";

            row.style.lineHeight =
                "1.5";


            row.innerHTML = `

                <span
                    class="cft-summary-name"
                    style="text-align:left; flex:1;"
                >

                    <b>
                        ${index}.
                        ${escapeHTML(
                            group.wood
                        )}
                        (${escapeHTML(
                            group.quality
                        )})
                    </b>

                </span>

                <span
                    class="cft-summary-value"
                    style="text-align:right; min-width:100px;"
                >

                    ${group.cft.toFixed(2)} CFT

                </span>

            `;


            cftSummary.appendChild(
                row
            );


            index++;

        }
    );

}

// ============================================================
// PRINT
// ============================================================

if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function () {

            console.log(
                "PRINT BILL"
            );


            window.print();

        }
    );

}


// ============================================================
// HOME
// ============================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// CLEAR
// ============================================================

if (
    clearBtn
) {

    clearBtn.addEventListener(
        "click",
        function () {

            const ok =
                confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (
                !ok
            ) {

                return;

            }


            // ------------------------------------------------
            // BILL DATA
            // ------------------------------------------------

            localStorage.removeItem(
                "current_bill_data"
            );


            // ------------------------------------------------
            // SAVED BILL
            // ------------------------------------------------

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            // ------------------------------------------------
            // WOOD
            // ------------------------------------------------

            localStorage.removeItem(
                "woodData"
            );

            localStorage.removeItem(
                "wood_page_data"
            );

            localStorage.removeItem(
                "wood"
            );

            localStorage.removeItem(
                "woodDataStorage"
            );


            // ------------------------------------------------
            // CUSTOMER
            // ------------------------------------------------

            localStorage.removeItem(
                "customerName"
            );

            localStorage.removeItem(
                "customerMobile"
            );

            localStorage.removeItem(
                "customerPlace"
            );


            // ------------------------------------------------
            // LABOUR / OTHER
            // ------------------------------------------------

            localStorage.removeItem(
                "labour"
            );

            localStorage.removeItem(
                "labourData"
            );

            localStorage.removeItem(
                "labourCharge"
            );

            localStorage.removeItem(
                "otherCharge"
            );

            localStorage.removeItem(
                "othersData"
            );


            // ------------------------------------------------
            // DISCOUNT
            // ------------------------------------------------

            localStorage.removeItem(
                "discount"
            );

            localStorage.removeItem(
                "discountAmount"
            );

            localStorage.removeItem(
                "discountApplied"
            );


            // ------------------------------------------------
            // ADVANCE
            // ------------------------------------------------

            localStorage.removeItem(
                "advance"
            );

            localStorage.removeItem(
                "advanceAmount"
            );

            localStorage.removeItem(
                "balanceAmount"
            );


            // ------------------------------------------------
            // TOTALS
            // ------------------------------------------------

            localStorage.removeItem(
                "grandTotal"
            );

            localStorage.removeItem(
                "finalTotal"
            );

            localStorage.removeItem(
                "subtotal"
            );

            localStorage.removeItem(
                "woodTotal"
            );

            localStorage.removeItem(
                "othersTotal"
            );


            // ------------------------------------------------
            // BILL STATUS
            // ------------------------------------------------

            localStorage.removeItem(
                "billConfirmed"
            );

            localStorage.removeItem(
                "billConfirmedAt"
            );

            localStorage.removeItem(
                "editingBill"
            );


            sessionStorage.clear();


            console.log(
                "ALL BILL DATA CLEARED"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// START
// ============================================================

console.log(
    "STARTING CBILL..."
);


loadFinalBill();

==================== server.js ====================

// ======================================================
// WOODSHOP BACKEND - SERVER.JS
// COMPLETE UPDATED VERSION
// ======================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const path = require("path");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname)));


// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "WoodShop Backend is Running..."
    });

});


// ======================================================
// DATABASE TEST
// ======================================================

app.get("/db-test", (req, res) => {

    connection.query(
        "SELECT 1 AS test",
        (err, results) => {

            if (err) {

                console.error(
                    "DATABASE CONNECTION ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database connection failed",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }

            res.json({

                success: true,

                message:
                    "Database connected successfully",

                result:
                    results

            });

        }
    );

});


// ======================================================
// SAVE BILL
// ======================================================

app.post("/save-bill", (req, res) => {

    const bill = req.body;


    console.log(
        "======================================"
    );

    console.log(
        "SAVE BILL REQUEST"
    );

    console.log(
        "======================================"
    );

    console.log(
        JSON.stringify(
            bill,
            null,
            2
        )
    );


    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!bill || typeof bill !== "object") {

        return res.status(400).json({

            success: false,

            message:
                "Bill data is required"

        });

    }


    // ==================================================
    // GENERATE BILL NUMBER + CUSTOMER ID
    // ==================================================

    const getNextNumberSQL = `

        SELECT COUNT(*) AS total
        FROM bills

    `;


    connection.query(
        getNextNumberSQL,
        (numberError, numberResult) => {

            if (numberError) {

                console.error(
                    "BILL NUMBER GENERATION ERROR:",
                    numberError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Could not generate bill number",

                    error:
                        numberError.message,

                    code:
                        numberError.code

                });

            }


            // ==================================================
            // NEXT NUMBER
            // ==================================================

            const totalBills =
                Number(
                    numberResult[0].total
                ) || 0;


            const nextNumber =
                totalBills + 1;


            // ==================================================
            // BILL NUMBER
            // ==================================================

            const billNo =
                "BILL-" +
                String(nextNumber)
                    .padStart(4, "0");


            // ==================================================
            // CUSTOMER ID
            // ==================================================

            const customerId =
                "CUST-" +
                String(nextNumber)
                    .padStart(4, "0");


            console.log(
                "Total Bills:",
                totalBills
            );

            console.log(
                "Next Number:",
                nextNumber
            );

            console.log(
                "Generated Bill Number:",
                billNo
            );

            console.log(
                "Generated Customer ID:",
                customerId
            );


            // ==================================================
            // CUSTOMER INFORMATION
            // ==================================================

            const customerName =
                bill.customerName || "";

            const customerMobile =
                bill.customerMobile || "";

            const customerPlace =
                bill.customerPlace || "";


            // ==================================================
            // DATE / TIME
            // ==================================================

            const billDate =
                bill.billDate || null;

            const billTime =
                bill.billTime || null;


            // ==================================================
            // PAYMENT TYPE
            //
            // cash
            // advance
            // ==================================================

            const paymentType =
                String(
                    bill.paymentType || ""
                ).trim();


            // ==================================================
            // PAYMENT MODE
            //
            // cash
            // upi
            // ==================================================

            const paymentMode =
                String(
                    bill.paymentMode || ""
                ).trim();


            // ==================================================
            // MONEY VALUES
            //
            // ALL MONEY = INTEGER
            // ==================================================

            const advanceAmount =
                Math.round(
                    Number(
                        bill.advanceAmount
                    ) || 0
                );


            const balanceAmount =
                Math.round(
                    Number(
                        bill.balanceAmount
                    ) || 0
                );


            // ==================================================
            // CFT
            //
            // CFT CAN HAVE DECIMAL VALUES
            // ==================================================

            const totalCFT =
                Number(
                    bill.totalCFT
                ) || 0;


            // ==================================================
            // WOOD TOTAL
            // ==================================================

            const woodTotal =
                Math.round(
                    Number(
                        bill.woodTotal
                    ) || 0
                );


            // ==================================================
            // LABOUR CHARGE
            // ==================================================

            const labourCharge =
                Math.round(
                    Number(
                        bill.labourCharge
                    ) || 0
                );


            // ==================================================
            // MAIN OTHER CHARGE
            // ==================================================

            const otherCharge =
                Math.round(
                    Number(
                        bill.otherCharge
                    ) || 0
                );


            // ==================================================
            // ALL OTHER CHARGES TOTAL
            // ==================================================

            const othersTotal =
                Math.round(
                    Number(
                        bill.othersTotal
                    ) || 0
                );


            // ==================================================
            // DISCOUNT
            // ==================================================

            const discountAmount =
                Math.round(
                    Number(
                        bill.discountAmount
                    ) || 0
                );


            // ==================================================
            // GRAND TOTAL
            // ==================================================

            const grandTotal =
                Math.round(
                    Number(
                        bill.grandTotal
                    ) || 0
                );


            // ==================================================
            // RETURN AMOUNT
            //
            // NEW BILL = 0 RETURN
            // ==================================================

            const returnAmount = 0;


            // ==================================================
            // STATUS
            //
            // BALANCE > 0
            //     PENDING
            //
            // BALANCE = 0
            //     DELIVERED
            // ==================================================

            let status = "DELIVERED";

            if (balanceAmount > 0) {

                status = "PENDING";

            }


            // ==================================================
            // WOOD JSON DATA
            // ==================================================

            const woodData =
                JSON.stringify(
                    bill.woodData || []
                );


            // ==================================================
            // OTHER CHARGES JSON DATA
            // ==================================================

            const othersData =
                JSON.stringify(
                    bill.othersData || []
                );


            // ==================================================
            // REMARK
            // ==================================================

            const remark =
                bill.remark || "";


            // ==================================================
            // DEBUG
            // ==================================================

            console.log(
                "--------------------------------------"
            );

            console.log(
                "CUSTOMER NAME:",
                customerName
            );

            console.log(
                "CUSTOMER MOBILE:",
                customerMobile
            );

            console.log(
                "CUSTOMER PLACE:",
                customerPlace
            );

            console.log(
                "PAYMENT TYPE:",
                paymentType
            );

            console.log(
                "PAYMENT MODE:",
                paymentMode
            );

            console.log(
                "TOTAL CFT:",
                totalCFT
            );

            console.log(
                "WOOD TOTAL:",
                woodTotal
            );

            console.log(
                "LABOUR CHARGE:",
                labourCharge
            );

            console.log(
                "OTHER CHARGE:",
                otherCharge
            );

            console.log(
                "OTHERS TOTAL:",
                othersTotal
            );

            console.log(
                "DISCOUNT:",
                discountAmount
            );

            console.log(
                "GRAND TOTAL:",
                grandTotal
            );

            console.log(
                "ADVANCE:",
                advanceAmount
            );

            console.log(
                "BALANCE:",
                balanceAmount
            );

            console.log(
                "STATUS:",
                status
            );

            console.log(
                "--------------------------------------"
            );


            // ==================================================
            // INSERT BILL
            //
            // 25-COLUMN TABLE
            // ==================================================

            const sql = `

                INSERT INTO bills
                (

                    bill_no,
                    customer_id,

                    customer_name,
                    customer_mobile,
                    customer_place,

                    bill_date,
                    bill_time,

                    payment_type,
                    payment_mode,

                    advance_amount,
                    balance_amount,

                    total_cft,

                    wood_total,
                    labour_charge,
                    other_charge,
                    others_total,

                    discount_amount,
                    grand_total,

                    wood_data,
                    others_data,

                    remark,

                    return_amount,
                    status

                )

                VALUES
                (

                    ?,
                    ?,

                    ?,
                    ?,
                    ?,

                    ?,
                    ?,

                    ?,
                    ?,

                    ?,
                    ?,

                    ?,

                    ?,
                    ?,
                    ?,
                    ?,

                    ?,
                    ?,

                    ?,
                    ?,

                    ?,

                    ?,
                    ?

                )

            `;


            // ==================================================
            // VALUES
            // ==================================================

            const values = [

                billNo,
                customerId,

                customerName,
                customerMobile,
                customerPlace,

                billDate,
                billTime,

                paymentType,
                paymentMode,

                advanceAmount,
                balanceAmount,

                totalCFT,

                woodTotal,
                labourCharge,
                otherCharge,
                othersTotal,

                discountAmount,
                grandTotal,

                woodData,
                othersData,

                remark,

                returnAmount,
                status

            ];


            // ==================================================
            // DATABASE INSERT
            // ==================================================

            connection.query(
                sql,
                values,
                (err, result) => {

                    if (err) {

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "DATABASE SAVE ERROR"
                        );

                        console.error(
                            "======================================"
                        );

                        console.error(
                            "Message:",
                            err.message
                        );

                        console.error(
                            "Code:",
                            err.code
                        );

                        console.error(
                            "SQL:",
                            sql
                        );

                        console.error(
                            "Values:",
                            values
                        );

                        console.error(
                            "======================================"
                        );


                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                err.message,

                            code:
                                err.code

                        });

                    }


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    console.log(
                        "======================================"
                    );

                    console.log(
                        "BILL SAVED SUCCESSFULLY"
                    );

                    console.log(
                        "======================================"
                    );

                    console.log(
                        "Database ID:",
                        result.insertId
                    );

                    console.log(
                        "Bill Number:",
                        billNo
                    );

                    console.log(
                        "Customer ID:",
                        customerId
                    );

                    console.log(
                        "Grand Total:",
                        grandTotal
                    );

                    console.log(
                        "Status:",
                        status
                    );

                    console.log(
                        "======================================"
                    );


                    // ==================================================
                    // RESPONSE
                    // ==================================================

                    return res.json({

                        success: true,

                        message:
                            "Bill Saved Successfully",

                        billId:
                            result.insertId,

                        billNo:
                            billNo,

                        customerId:
                            customerId,

                        status:
                            status,

                        grandTotal:
                            grandTotal

                    });

                }

            );

        }

    );

});


// ======================================================
// GET ALL BILLS
// ======================================================

app.get("/bills", (req, res) => {

    const sql = `

        SELECT *
        FROM bills
        ORDER BY id DESC

    `;


    connection.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "GET ALL BILLS ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// ======================================================
// GET PENDING BILLS
// ======================================================

app.get("/pending-bills", (req, res) => {

    const sql = `

        SELECT
            id,
            bill_no,
            customer_id,
            customer_name,
            customer_mobile,
            customer_place,
            bill_date,
            payment_type,
            payment_mode,
            advance_amount,
            balance_amount,
            discount_amount,
            grand_total,
            return_amount,
            status,
            remark

        FROM bills

        WHERE status = 'PENDING'
           OR balance_amount > 0

        ORDER BY id DESC

    `;


    connection.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "GET PENDING BILLS ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                bills:
                    results

            });

        }
    );

});


// ======================================================
// GET SINGLE BILL
// ======================================================

app.get("/bill/:id", (req, res) => {

    const id =
        req.params.id;


    const sql = `

        SELECT *
        FROM bills
        WHERE id = ?

    `;


    connection.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.error(
                    "GET SINGLE BILL ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            res.json({

                success: true,

                bill:
                    results[0]

            });

        }
    );

});


// ======================================================
// UPDATE PENDING BILL PAYMENT
// ======================================================

app.put("/update-pending", (req, res) => {

    const {
        id,
        paidAmount,
        paymentMode
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        !id ||
        paidAmount === undefined
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID and paid amount are required"

        });

    }


    const payment =
        Math.round(
            Number(paidAmount)
        );


    if (
        isNaN(payment) ||
        payment <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Paid amount must be greater than 0"

        });

    }


    // ==================================================
    // GET CURRENT BILL
    // ==================================================

    connection.query(

        `

            SELECT
                advance_amount,
                balance_amount,
                payment_mode,
                status

            FROM bills

            WHERE id = ?

        `,

        [id],

        (err, results) => {

            if (err) {

                console.error(
                    "SELECT PENDING BILL ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            // ==================================================
            // OLD VALUES
            // ==================================================

            const advance =
                Number(
                    results[0].advance_amount
                ) || 0;


            const balance =
                Number(
                    results[0].balance_amount
                ) || 0;


            // ==================================================
            // DON'T PAY MORE THAN BALANCE
            // ==================================================

            const actualPayment =
                Math.min(
                    payment,
                    balance
                );


            // ==================================================
            // NEW VALUES
            // ==================================================

            const newAdvance =
                Math.round(
                    advance +
                    actualPayment
                );


            const newBalance =
                Math.max(
                    0,
                    Math.round(
                        balance -
                        actualPayment
                    )
                );


            // ==================================================
            // STATUS
            // ==================================================

            const newStatus =
                newBalance <= 0
                    ? "DELIVERED"
                    : "PENDING";


            // ==================================================
            // PAYMENT MODE
            // ==================================================

            const newPaymentMode =
                String(
                    paymentMode ||
                    results[0].payment_mode ||
                    ""
                ).trim();


            // ==================================================
            // UPDATE
            // ==================================================

            connection.query(

                `

                    UPDATE bills

                    SET

                        advance_amount = ?,

                        balance_amount = ?,

                        payment_mode = ?,

                        status = ?

                    WHERE id = ?

                `,

                [

                    newAdvance,

                    newBalance,

                    newPaymentMode,

                    newStatus,

                    id

                ],

                (updateError) => {

                    if (updateError) {

                        console.error(
                            "UPDATE PENDING BILL ERROR:",
                            updateError
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                updateError.message,

                            code:
                                updateError.code

                        });

                    }


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    res.json({

                        success: true,

                        message:
                            "Payment Updated Successfully",

                        advanceAmount:
                            newAdvance,

                        balanceAmount:
                            newBalance,

                        paymentMode:
                            newPaymentMode,

                        status:
                            newStatus

                    });

                }

            );

        }

    );

});


// ======================================================
// RETURN BILL
// ======================================================
//
// User sends:
//
// {
//     id: 10,
//     returnAmount: 500
// }
//
// The return amount is added to the existing return amount.
//
// Grand total is reduced by the return amount.
//
// Status becomes RETURN.
// ======================================================

app.put("/return-bill", (req, res) => {

    const {
        id,
        returnAmount
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        !id ||
        returnAmount === undefined
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID and return amount are required"

        });

    }


    const amount =
        Math.round(
            Number(returnAmount)
        );


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Return amount must be greater than 0"

        });

    }


    // ==================================================
    // GET BILL
    // ==================================================

    connection.query(

        `

            SELECT

                grand_total,
                return_amount,
                status

            FROM bills

            WHERE id = ?

        `,

        [id],

        (err, results) => {

            if (err) {

                console.error(
                    "GET RETURN BILL ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Bill Not Found"

                });

            }


            // ==================================================
            // OLD VALUES
            // ==================================================

            const oldGrandTotal =
                Math.round(
                    Number(
                        results[0].grand_total
                    ) || 0
                );


            const oldReturnAmount =
                Math.round(
                    Number(
                        results[0].return_amount
                    ) || 0
                );


            // ==================================================
            // DON'T RETURN MORE THAN GRAND TOTAL
            // ==================================================

            const availableAmount =
                Math.max(
                    0,
                    oldGrandTotal
                );


            const actualReturn =
                Math.min(
                    amount,
                    availableAmount
                );


            // ==================================================
            // NEW RETURN TOTAL
            // ==================================================

            const newReturnAmount =
                Math.round(
                    oldReturnAmount +
                    actualReturn
                );


            // ==================================================
            // NEW GRAND TOTAL
            // ==================================================

            const newGrandTotal =
                Math.max(
                    0,
                    Math.round(
                        oldGrandTotal -
                        actualReturn
                    )
                );


            // ==================================================
            // STATUS
            // ==================================================

            const newStatus =
                "RETURN";


            // ==================================================
            // UPDATE
            // ==================================================

            connection.query(

                `

                    UPDATE bills

                    SET

                        grand_total = ?,

                        return_amount = ?,

                        status = ?

                    WHERE id = ?

                `,

                [

                    newGrandTotal,

                    newReturnAmount,

                    newStatus,

                    id

                ],

                (updateError) => {

                    if (updateError) {

                        console.error(
                            "RETURN BILL UPDATE ERROR:",
                            updateError
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Database Error",

                            error:
                                updateError.message,

                            code:
                                updateError.code

                        });

                    }


                    // ==================================================
                    // SUCCESS
                    // ==================================================

                    res.json({

                        success: true,

                        message:
                            "Bill Returned Successfully",

                        returnAmount:
                            newReturnAmount,

                        grandTotal:
                            newGrandTotal,

                        status:
                            newStatus

                    });

                }

            );

        }

    );

});


// ======================================================
// UPDATE REMARK
// ======================================================

app.post("/update-remark", (req, res) => {

    const {
        id,
        remark
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!id) {

        return res.status(400).json({

            success: false,

            message:
                "Bill ID is required"

        });

    }


    // ==================================================
    // SQL
    // ==================================================

    const sql = `

        UPDATE bills

        SET remark = ?

        WHERE id = ?

    `;


    connection.query(
        sql,
        [
            remark || "",
            id
        ],
        (err) => {

            if (err) {

                console.error(
                    "UPDATE REMARK ERROR:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error",

                    error:
                        err.message,

                    code:
                        err.code

                });

            }


            res.json({

                success: true,

                message:
                    "Remark Saved Successfully"

            });

        }
    );

});


// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API route not found",

        path:
            req.originalUrl

    });

});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "======================================"
        );

        console.error(
            "SERVER ERROR"
        );

        console.error(
            "======================================"
        );

        console.error(err);


        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }
);


// ======================================================
// LOCAL DEVELOPMENT SERVER
// ======================================================

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;


    app.listen(
        PORT,
        "0.0.0.0",
        () => {

            console.log(
                "======================================"
            );

            console.log(
                "WOODSHOP BACKEND STARTED"
            );

            console.log(
                "======================================"
            );

            console.log(
                "Server running on port:",
                PORT
            );

            console.log(
                "======================================"
            );

        }
    );

}


// ======================================================
// VERCEL
// ======================================================

module.exports = app;
