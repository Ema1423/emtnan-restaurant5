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

        // لو الباك يرجع: { order: {...} }
        if (raw.order) return raw.order;

        return raw;
    }

    // طلب بيانات الفاتورة من السيرفر
    fetch(`https://emtnan-restaurant5.onrender.com/invoice/${orderID}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }
            return res.json();
        })
        .then(raw => {

            const order = normalizeOrder(raw);
            if (!order) throw new Error("Invalid invoice format");

            // تعبئة بيانات العميل
            document.getElementById("orderNumber").textContent = order.order_id || "-";
            document.getElementById("custName").textContent = order.name || "-";
            document.getElementById("custPhone").textContent = order.phone || "-";
            document.getElementById("custAddress").textContent = order.address || "-";
            document.getElementById("custPayment").textContent = order.payment || "-";

            // الأصناف
            const items = order.cart || [];
            const itemsList = document.getElementById("itemsList");
            itemsList.innerHTML = "";

            items.forEach(item => {
                const li = document.createElement("li");

                li.innerHTML = `
                    <span>${item.name || "-"}</span>
                    <span>x ${item.quantity || 1}</span>
                    <span>${item.price || 0} SAR</span>
                `;

                itemsList.appendChild(li);
            });

            // الحسابات
            const subtotal = Number(order.subtotal) || 0;
            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " SAR";
            document.getElementById("tax").textContent = tax.toFixed(2) + " SAR";
            document.getElementById("total").textContent = total.toFixed(2) + " SAR";

            // رابط الواتساب
            const wpBtn = document.getElementById("wpConfirm");
            if (wpBtn) {
                const msg = `Hello ${order.name}\nYour order #${order.order_id} total is ${total.toFixed(2)} SAR.`;
                wpBtn.href = `https://wa.me/${order.phone}?text=${encodeURIComponent(msg)}`;
            }

        })
        .catch(err => {
            console.error("ERROR:", err);
            alert("Failed to load invoice!");
        });

});