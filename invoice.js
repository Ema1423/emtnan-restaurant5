// ===== قراءة البيانات المحفوظة =====
const orderData = JSON.parse(localStorage.getItem("orderData")) || null;
const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo")) || null;
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// لو ما فيه بيانات → رجوع
if (!orderData || cart.length === 0) {
    window.location.href = "checkout.html";
}

// ===== عناصر الفاتورة =====
document.getElementById("invName").textContent = orderData.name;
document.getElementById("invPhone").textContent = orderData.phone;
document.getElementById("invAddress").textContent = orderData.address;
document.getElementById("invPayment").textContent = paymentInfo?.method || orderData.payment;

// ==== عرض المنتجات ====
const listEl = document.getElementById("invItems");
listEl.innerHTML = "";

let subtotal = 0;

cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "review-item";
    li.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} SAR</span>
    `;
    listEl.appendChild(li);

    subtotal += item.price * item.quantity;
});

// ==== حساب الإجماليات ====
const tax = subtotal * 0.05;  // 5%
const delivery = 5;
const total = subtotal + tax + delivery;

// ==== عرض الإجماليات ====
document.getElementById("invSubtotal").textContent = subtotal.toFixed(2) + " SAR";
document.getElementById("invTax").textContent = tax.toFixed(2) + " SAR";
document.getElementById("invTotal").textContent = total.toFixed(2) + " SAR";

// =====================
// تنظيف السلة بعد إصدار الفاتورة
// =====================
function clearAfterInvoice() {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartCount");
    localStorage.removeItem("orderData");
    localStorage.removeItem("paymentInfo");
    localStorage.removeItem("order_id");
}

// نفذ التنظيف بعد تحميل الفاتورة بثانيتين
setTimeout(clearAfterInvoice, 2000);