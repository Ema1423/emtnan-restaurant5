// ====================== Smooth Scroll ======================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ====================== CART SYSTEM ======================

// عداد السلة
let cartCount = 0;
const cartBadge = document.querySelector(".cart-badge");

// السلة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحديث رقم السلة عند الدخول
updateCartCount();

// الأزرار
const addButtons = document.querySelectorAll(".dish-add-btn");

addButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // بيانات الطبق
    const card = btn.closest(".dish-card");
    const dishName = card.querySelector(".dish-title").textContent;
    const priceText = card.querySelector(".dish-price").getAttribute("data-price");
    const imageSrc = card.querySelector("img").src;
    const price = Number(priceText);
    
    

    // هل المنتج موجود؟
    const existingItem = cart.find(item => item.name === dishName);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name: dishName,
        price: price,
        quantity: 1,
        image: imageSrc
      });
    }

    // حفظ التغيير
    localStorage.setItem("cart", JSON.stringify(cart));

    // تحديث الرقم
    updateCartCount();

    // إظهار الرسالة
    showMessage("✓ تمت إضافة الطبق إلى السلة");
  });
});

// تحديث عدد السلة
function updateCartCount() {
  let totalQty = 0;
  cart.forEach(item => {
    totalQty += item.quantity;
  });
  cartBadge.textContent = totalQty;
}

// ====================== Popup Message ======================
function showMessage(text) {
  const div = document.createElement("div");
  div.className = "popup";
  div.textContent = text;
  document.body.appendChild(div);

  setTimeout(() => div.classList.add("show"), 50);
  setTimeout(() => div.classList.add("hide"), 1800);
  setTimeout(() => div.remove(), 2500);
}

// ====================== Mini Cart (Go To Cart Page) ======================
const cartIcon = document.querySelector(".cart-btn");
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

// ====================== Reservation Form ======================
const reserveForm = document.querySelector(".reserve-form");
if (reserveForm) {
  reserveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showMessage("تم حجز الطاولة بنجاح ✔");
    reserveForm.reset();
  });
}