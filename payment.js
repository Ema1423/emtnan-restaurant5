// قراءة بيانات الطلب المحفوظة من checkout
const orderData = JSON.parse(localStorage.getItem("orderData")) || null;
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// عناصر صفحة الـ Summary
const listEl = document.getElementById("paymentOrderList");
const subtotalEl = document.getElementById("paySubtotal");
const taxEl = document.getElementById("payTax");
const deliveryEl = document.getElementById("payDelivery");
const totalEl = document.getElementById("payTotal");

// لو ما فيه بيانات طلب →  المستخدم يرجع للـ checkout
if (!orderData || cart.length === 0) {
  window.location.href = "checkout.html";
}

// ====== عرض المنتجات في ملخص الدفع ======
function renderPaymentSummary() {
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

  const tax = subtotal * 0.15;  
  const total = subtotal + tax + delivery;

  subtotalEl.textContent = subtotal.toFixed(2) + " SAR";
  taxEl.textContent = `${tax.toFixed(2)} SAR`;
  deliveryEl.textContent = `${delivery.toFixed(2)} SAR`;
  totalEl.textContent = total.toFixed(2) + " SAR";
}

renderPaymentSummary();

// ====== إظهار/إخفاء حقول البطاقة ======
const paymentForm = document.getElementById("paymentForm");
const cardFields = document.getElementById("cardFields");
const paymentRadios = document.querySelectorAll("input[name='paymentType']");

paymentRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Card" && radio.checked) {
      cardFields.style.display = "block";
    } else if (radio.value === "Cash" && radio.checked) {
      cardFields.style.display = "none";
    }
  });
});

// تأكد أن الوضع الأول Card ظاهر
cardFields.style.display = "block";

// ====== عند تأكيد الدفع ======
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedType = document.querySelector("input[name='paymentType']:checked")?.value;

  // لو بطاقة → تحقق من إدخال بيانات البطاقة
  if (selectedType === "Card") {
    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value.trim();
    const cardCVV = document.getElementById("cardCVV").value.trim();

    if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
      alert("Please fill all card details.");
      return;
    }
  }

  // تخزين بيانات الدفع
  const paymentInfo = {
    method: selectedType,
    total: totalEl.textContent,
    date: new Date().toLocaleString("en-SA"),
  };

  localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

  // إرسال الطلب للباك اند

  // تخزين الفاتورة
  localStorage.setItem("invoice_cart", JSON.stringify(cart));
  localStorage.setItem("invoice_totals", JSON.stringify({
    subtotal: subtotalEl.textContent,
    tax: taxEl.textContent,
    total: totalEl.textContent
  }));

  // تفريغ السلة بعد الدفع
  localStorage.removeItem("cart");
  //localStorage.removeItem("orderData");

  // نقل المستخدم لصفحة التأكيد
  window.location.href = "confirmation.html";
});
