from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os, uuid

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ==============================
# دوال المساعدة للقراءة والكتابة
# ==============================
def load_file(filename):
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return []


def save_file(filename, data):
    path = os.path.join(BASE_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)



# ==============================
# جلب المنتجات
# ==============================
@app.get("/products")
def get_products():
    products = load_file("products.json")
    return jsonify(products), 200



# ==============================
# جلب السلة
# ==============================
@app.get("/cart")
def get_cart():
    cart = load_file("cart.json")
    return jsonify(cart), 200



# ==============================
# إنشاء الطلب
# ==============================
@app.post("/create-order")
def create_order():
    data = request.json
    orders = load_file("orders.json")

    order_id = str(uuid.uuid4().int)[:6]  # رقم طلب عشوائي

    new_order = {
        "order_id": order_id,
        "name": data.get("name"),
        "phone": data.get("phone"),
        "address": data.get("address"),
        "payment": data.get("payment"),
        "cart": data.get("cart"),
        "subtotal": data.get("subtotal"),
        "status": "Pending"   # الحالة الافتراضية
    }

    orders.append(new_order)
    save_file("orders.json", orders)

    return jsonify({"success": True, "order_id": order_id}), 200



# ==============================
# جلب جميع الطلبات (لوحة التحكم)
# ==============================
@app.get("/orders")
def get_all_orders():
    orders = load_file("orders.json")
    return jsonify(orders), 200



# ==============================
# تحديث حالة الطلب (آمن ولا يلمس الفاتورة)
# ==============================
@app.put("/order-status/<order_id>")
def update_status(order_id):
    orders = load_file("orders.json")
    new_status = request.json.get("status")

    updated = False
    for order in orders:
        if str(order.get("order_id")) == str(order_id):
            order["status"] = new_status
            updated = True
            break

    if not updated:
        return jsonify({"error": "Order not found"}), 404

    save_file("orders.json", orders)
    return jsonify({"success": True, "message": "Status updated"}), 200



# ==============================
# حذف الطلب (لوحة التحكم فقط — لا يؤثر على العميل)
# ==============================
@app.delete("/delete-order/<order_id>")
def delete_order(order_id):
    orders = load_file("orders.json")
    new_list = [order for order in orders if str(order.get("order_id")) != str(order_id)]

    if len(new_list) == len(orders):
        return jsonify({"error": "Order not found"}), 404

    save_file("orders.json", new_list)
    return jsonify({"success": True, "message": "Order deleted"}), 200



# ==============================
# جلب فاتورة الطلب (يستخدمه confirmation + invoice)
# ==============================
@app.get("/invoice/<order_id>")
def get_invoice(order_id):
    orders = load_file("orders.json")

    for order in orders:
        if str(order.get("order_id")) == str(order_id):
            return jsonify(order), 200

    return jsonify({"error": "Order not found"}), 404
# تشغيل الباك اند
# ==============================
if __name__ == "_main_":
    app.run(debug=True, host="127.0.0.1", port=5000)