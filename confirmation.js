document.addEventListener("DOMContentLoaded", () => {
    // قراءة رقم الطلب من localStorage
    const orderID = localStorage.getItem("order_id");

    if (!orderID) {
        alert("No order found!");
        window.location.href = "index.html";
        return;
    }

    // دالة لتوحيد شكل البيانات
    function normalizeOrder(raw) {
        if (!raw) return null;

        // لو كان الباك يرجع: { "order": {...} }
        if (raw.order) return raw.order;

        // لو كان يرجع مباشرة {...}
        return raw;
    }

    // جلب الفاتورة من السيرفر
    fetch(`http://127.0.0.1:5000/invoice/${orderID}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(raw => {
            console.log("RAW ORDER:", raw);

            // توحيد شكل البيانات
            const order = normalizeOrder(raw);

            if (!order) {
                throw new Error("Invalid invoice format");
            }

            console.log("FINAL ORDER:", order);

            // ==============================
            // تعبئة بيانات العميل
            // ==============================
            document.getElementById("orderNumber").textContent = order.order_id || "-";
            document.getElementById("custName").textContent = order.name || "-";
            document.getElementById("custPhone").textContent = order.phone || "-";
            document.getElementById("custAddress").textContent = order.address || "-";
            document.getElementById("custPayment").textContent = order.payment || "-";

            // ==============================
            // عرض عناصر السلة
            // ==============================
            const items = order.cart || [];
            const itemsContainer = document.getElementById("itemsList");

            itemsContainer.innerHTML = "";

            items.forEach(item => {
                const row = document.createElement("div");
                row.classList.add("item-row");

                row.innerHTML = `
                    <div class="item-name">${item.name || "-"}</div>
                    <div class="item-qty">${item.quantity || 1}</div>
                    <div class="item-price">${item.price || 0} SAR</div>
                `;
                itemsContainer.appendChild(row);
            });

            // ==============================
            // حساب المجموع
            // ==============================
            const subtotal = Number(order.subtotal) || 0;
            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            document.getElementById("summarySubtotal").textContent = subtotal.toFixed(2) + " SAR";
            document.getElementById("summaryTax").textContent = tax.toFixed(2) + " SAR";
            document.getElementById("summaryTotal").textContent = total.toFixed(2) + " SAR";

            // ==============================
            // رابط الواتساب
            // ==============================
            const wpBtn = document.getElementById("wpConfirm");
            if (wpBtn && order.phone) {
                const msg = `Hello ${order.name || ""}\nYour order #${order.order_id} total is ${total.toFixed(2)} SAR.`;
                wpBtn.href = `https://wa.me/${order.phone}?text=${encodeURIComponent(msg)}`;
            }
        })
        .catch(err => {
            console.error("INVOICE ERROR:", err);
            alert(`Failed to load order details: ${err.message}`);
        });
});
