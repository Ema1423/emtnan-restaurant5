// حماية لوحة التحكم
if (localStorage.getItem("adminAuth") !== "true") {
    window.location.href = "admin-login.html";
}
// جلب كل الطلبات
   fetch("https://emtnan-restaurant5.onrender.com/orders")
  .then(res => res.json())
  .then(orders => {
    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    orders.forEach(order => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${order.order_id || order.order?.order_id || "-"}</td>
        <td>${order.name || order.order?.name || "-"}</td>
        <td>${order.phone || order.order?.phone || "-"}</td>
        <td>${order.total || order.order?.total || "-"}</td>
        <td>${order.payment?.method || order.order?.payment || "N/A"}</td>

        <!-- الحالة -->
        <td>
          <select onchange="changeStatus('${order.order_id}', this.value)">
            <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option ${order.status === 'Ready' ? 'selected' : ''}>Ready</option>
            <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>

        <!-- زر الحذف -->
        <td>
          <button class="delete-btn" data-id="${order.order_id}">
            Delete
          </button>
        </td>
      `;

      table.appendChild(tr);
    });

    // تفعيل زر الحذف
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteOrder(id);
      });
    });
  });


// دالة حذف الطلبية
function deleteOrder(id) {

    if (!confirm("Are you sure you want to delete this order?")) return;

    fetch(`https://emtnan-restaurant5.onrender.com/delete-order/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(msg => {
        alert("Order deleted!");
        location.reload();
    })
    .catch(err => console.error("DELETE ERROR:", err));
}
function logout() {
    localStorage.removeItem("adminAuth");
    window.location.href = "admin-login.html";
}
function changeStatus(orderID, newStatus) {

    fetch(`https://emtnan-restaurant5.onrender.com/order-status/${orderID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(data => {
        console.log("STATUS UPDATED:", data);
        alert("Order status updated!");
    })
    .catch(err => {
        console.error("STATUS ERROR:", err);
        alert("Failed to update status.");
    });
}