// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Elements
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("totalPrice");
const reviewList = document.getElementById("orderReview");

// ========== 1) عرض محتويات السلة ==========
function renderOrderReview() {
  reviewList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "review-item";
    li.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)} SAR</span>
    `;
    reviewList.appendChild(li);
  });
}

// ========== 2) حساب الإجمالي ==========
function updateTotals() {
  let subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  let tax = subtotal * 0.05; // 5% ضريبة
  let delivery = 5; // 5 ريال توصيل
  let total = subtotal + tax + delivery;

  subtotalEl.textContent = subtotal.toFixed(2) + " SAR";
  taxEl.textContent = tax.toFixed(2) + " SAR";
  totalEl.textContent = total.toFixed(2) + " SAR";
}

renderOrderReview();
updateTotals();

// ========== 3) متابعة الدفع ==========
 async function submitOrder() {

  const orderData = {
    name: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    payment: document.querySelector("input[name='payment']:checked")?.value,
    notes: document.getElementById("notes").value,
    cart: cart,
    subtotal: subtotalEl.textContent,
    tax: taxEl.textContent,
    total: totalEl.textContent
  };

  if (!orderData.name || !orderData.phone || !orderData.address || !orderData.payment) {
    alert("Please fill all required fields.");
    return;
  }

  // احفظ كل البيانات في localStorage
  localStorage.setItem("orderData", JSON.stringify(orderData));

  // روحي لصفحة الدفع
  window.location.href = "payment.html";
}
