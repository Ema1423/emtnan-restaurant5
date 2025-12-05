// ================= تحميل السلة =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// عناصر HTML
const cartList = document.getElementById("cartItems");
const subtotalText = document.getElementById("subtotal");
const taxText = document.getElementById("tax");
const totalText = document.getElementById("total");

// ================= تحديث صفحة السلة =================
function updateCart() {
    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "cart-item";

        li.innerHTML = `
            <img src="${item.image}" class="item-image" />

            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-price">${item.price} SAR each</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>

            <div class="qty-box">
                <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQty(${index})">+</button>
            </div>

            <div class="item-total">${(item.price * item.quantity).toFixed(2)} SAR</div>
        `;

        cartList.appendChild(li);

        subtotal += item.price * item.quantity;
    });

    let tax = subtotal * 0.15;       // الضريبة 15%
    let total = subtotal + tax + 5;  // توصيل ثابت 5 SAR

    subtotalText.textContent = subtotal.toFixed(2) + " SAR";
    taxText.textContent = tax.toFixed(2) + " SAR";
    totalText.textContent = total.toFixed(2) + " SAR";

    localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= زيادة الكمية =================
function increaseQty(i) {
    cart[i].quantity++;
    updateCart();
}

// ================= إنقاص الكمية =================
function decreaseQty(i) {
    if (cart[i].quantity > 1) {
        cart[i].quantity--;
    } else {
        cart.splice(i, 1);
    }
    updateCart();
}

// ================= حذف عنصر =================
function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

// ================= تفريغ السلة =================
document.getElementById("clearCart")?.addEventListener("click", () => {
    cart = [];
    updateCart();
});

// أول تحديث عند تحميل الصفحة
updateCart();