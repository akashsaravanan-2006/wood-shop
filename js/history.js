        /* =========================================================
           HISTORY.JS
           VERSION: MULTI-RETURN + BROWSER PDF VIEW FIX
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
                const gt = grandTotal(bill);
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
                                : ""
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

            // The current grand_total is the remaining amount that can be returned.
            const remainingTotal = grandTotal(bill);

            if (remainingTotal <= 0) {
                alert("No amount is left to return for this bill.");
                return;
            }

            const value = prompt(
                `Enter Return Amount\n\nBill No: ${no}\nRemaining Grand Total: ₹ ${fmt(remainingTotal)}`
            );

            if (value === null) return;

            const amount = Number(
                String(value).replace(/,/g, "").trim()
            );

            if (!Number.isFinite(amount) || amount <= 0) {
                alert("Enter a valid return amount greater than 0.");
                return;
            }

            if (amount > remainingTotal) {
                alert(
                    "Return amount cannot be greater than the remaining Grand Total.\n\n" +
                    `Remaining: ₹ ${fmt(remainingTotal)}`
                );
                return;
            }

            if (!confirm(
                `Confirm return?\n\n` +
                `Bill: ${no}\n` +
                `Return now: ₹ ${fmt(amount)}\n` +
                `Remaining after return: ₹ ${fmt(Math.max(0, remainingTotal - amount))}`
            )) {
                return;
            }

            try {
                // IMPORTANT:
                // Use the backend's cumulative return endpoint.
                // Every call adds to return_amount and reduces grand_total.
                const response = await fetch(
                    `${API_URL}/return-bill`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: id,
                            returnAmount: amount
                        })
                    }
                );

                let result = null;

                try {
                    result = await response.json();
                } catch {
                    result = null;
                }

                if (!response.ok || !result?.success) {
                    throw new Error(
                        result?.message ||
                        `HTTP ${response.status}: Return update failed.`
                    );
                }

                const newGrandTotal = money(result?.grandTotal);
                const newReturnAmount = money(result?.returnAmount);

                alert(
                    "Return saved successfully.\n\n" +
                    `Returned this time: ₹ ${fmt(amount)}\n` +
                    `Total returned: ₹ ${fmt(newReturnAmount)}\n` +
                    `Remaining Grand Total: ₹ ${fmt(newGrandTotal)}`
                );

                // Reload database values.
                // Return button remains while Grand Total > 0.
                await loadBills();

            } catch (error) {
                console.error("RETURN ERROR:", error);
                alert(
                    "Return update failed.\n\n" +
                    error.message
                );
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
            const total = grandTotal(bill);
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
           OPEN PDF IN BROWSER
           SAME TAB
           NO DOWNLOAD
           ========================================================= */

        async function downloadBillPDF(id, button) {

            const oldText =
                button?.textContent || "PDF";

            try {

                if (button) {
                    button.disabled = true;
                    button.textContent = "Creating...";
                }

                /* =====================================================
                   CHECK PDF LIBRARY
                   ===================================================== */

                if (
                    typeof window.html2pdf !== "function"
                ) {
                    throw new Error(
                        "PDF library did not load. Check your internet connection."
                    );
                }

                /* =====================================================
                   GET COMPLETE BILL
                   ===================================================== */

                const response =
                    await fetch(
                        `${API_URL}/bill/${encodeURIComponent(id)}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            cache: "no-store"
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `Bill API HTTP ${response.status}`
                    );

                }

                const result =
                    await response.json();

                const bill =
                    result?.bill ??
                    result?.data ??
                    result;

                if (!bill) {

                    throw new Error(
                        "Bill data not found."
                    );

                }

                console.log(
                    "COMPLETE BILL FOR PDF:",
                    bill
                );

                /* =====================================================
                   CREATE BILL HTML
                   ===================================================== */

                const wrapper =
                    document.createElement(
                        "div"
                    );

                wrapper.innerHTML =
                    pdfHTML(bill);

                /*
                   Keep the PDF template on the page only while
                   html2pdf creates the Blob.

                   It is NOT displayed as part of the history page.
                */

                wrapper.style.position =
                    "fixed";

                wrapper.style.left =
                    "-100000px";

                wrapper.style.top =
                    "0";

                wrapper.style.width =
                    "794px";

                wrapper.style.background =
                    "#ffffff";

                wrapper.style.zIndex =
                    "-1";

                wrapper.style.pointerEvents =
                    "none";

                document.body.appendChild(
                    wrapper
                );

                /* =====================================================
                   WAIT FOR HTML TO RENDER
                   ===================================================== */

                await new Promise(
                    resolve =>
                        requestAnimationFrame(
                            () =>
                                requestAnimationFrame(
                                    resolve
                                )
                        )
                );

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            250
                        )
                );

                /* =====================================================
                   CREATE PDF AS BLOB
                   IMPORTANT:
                   outputPdf("blob") DOES NOT DOWNLOAD
                   ===================================================== */

                const pdfBlob =
                    await html2pdf()
                        .set({
                            margin: 8,

                            image: {
                                type: "jpeg",
                                quality: 0.98
                            },

                            html2canvas: {
                                scale: 2,
                                useCORS: true,
                                allowTaint: false,
                                backgroundColor:
                                    "#ffffff",
                                logging: false,

                                scrollX: 0,
                                scrollY: 0,

                                windowWidth:
                                    794,

                                windowHeight:
                                    Math.max(
                                        1123,
                                        wrapper.scrollHeight
                                    )
                            },

                            jsPDF: {
                                unit: "mm",
                                format: "a4",
                                orientation:
                                    "portrait",
                                compress: true
                            },

                            pagebreak: {
                                mode: [
                                    "css",
                                    "legacy"
                                ]
                            }
                        })
                        .from(wrapper)
                        .outputPdf(
                            "blob"
                        );

                /* =====================================================
                   REMOVE TEMPORARY HTML
                   ===================================================== */

                wrapper.remove();

                /* =====================================================
                   VERIFY PDF
                   ===================================================== */

                if (
                    !pdfBlob ||
                    pdfBlob.size < 1000
                ) {

                    throw new Error(
                        "Generated PDF is empty."
                    );

                }

                console.log(
                    "PDF BLOB SIZE:",
                    pdfBlob.size
                );

                /* =====================================================
                   CREATE BLOB URL
                   ===================================================== */

                const pdfURL =
                    URL.createObjectURL(
                        pdfBlob
                    );

                console.log(
                    "PDF URL:",
                    pdfURL
                );

                /* =====================================================
                   OPEN PDF IN CURRENT TAB
                   =====================================================

                   IMPORTANT:

                   DO NOT use:
                       <a download>
                       link.download
                       .save()
                       window.open()
                       _blank

                   The browser's built-in PDF viewer will display
                   the generated bill.

                   This is the same approach used by your sample.
                   ===================================================== */

                window.location.assign(
                    pdfURL
                );

                /*
                   Do NOT immediately call URL.revokeObjectURL().
                   The browser PDF viewer still needs the Blob URL.
                */

            }
            catch (error) {

                console.error(
                    "PDF VIEW ERROR:",
                    error
                );

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        oldText;

                }

                alert(
                    "Unable to open bill PDF.\n\n" +
                    error.message
                );

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
