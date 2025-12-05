function checkStatus() {
    const orderID = document.getElementById("orderID").value.trim();
    const resultBox = document.getElementById("result");

    if (!orderID) {
        resultBox.style.color = "red";
        resultBox.textContent = "Please enter a valid Order ID.";
        return;
    }

    // نستخدم API الفاتورة لأنه يعيد الحالة
    fetch('http://127.0.0.1:5000/invoice/${orderID}')
        .then(res => res.json())
        .then(order => {

            if (order.error) {
                resultBox.style.color = "red";
                resultBox.textContent = "Order not found!";
                return;
            }

            // عرض البيانات
            resultBox.style.color = "#333";
            resultBox.innerHTML = `
                <p>Order Status: <strong>${order.status || "Pending"}</strong></p>
                <p>Total: <strong>${order.total}</strong></p>
            `;
        })
        .catch(err => {
            console.error(err);
            resultBox.style.color = "red";
            resultBox.textContent = "Server error. Try again.";
        });
}