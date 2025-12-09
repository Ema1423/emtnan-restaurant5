function checkStatus() {
    const orderID = document.getElementById("orderId").value.trim();
    const resultBox = document.getElementById("result");

    if (!orderID) {
        resultBox.style.color = "red";
        resultBox.textContent = "Please enter a valid Order ID.";
        return;
    }

    // هنا المشكلة… الآن تم حلها ⬇⬇⬇ (Backticks موجودة)
    fetch(`http://127.0.0.1:5000/invoice/${orderID}`)
        .then(res => res.json())
        .then(order => {
            if (order.error) {
                resultBox.style.color = "red";
                resultBox.textContent = "Order not found!";
                return;
            }

            resultBox.style.color = "green";
            resultBox.innerHTML = `
                <p><strong>Order ID:</strong> ${order.order_id}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Total:</strong> ${order.subtotal} SAR</p>
            `;
        })
        .catch(err => {
            console.error(err);
            resultBox.style.color = "red";
            resultBox.textContent = "Server error. Try again.";
        });
}