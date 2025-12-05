from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os, uuid

app = Flask(__name__)
CORS(app)

# =======================
#  مسار تخزين ملفات JSON
# =======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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

# ======================================
#  API — إنشاء الطلب وتخزينه في orders.json
# ======================================
@app.post("/create-order")
def create_order():
    data = request.json
    orders = load_file("orders.json")

    # إنشاء رقم طلب عشوائي مكوّن من 8 أرقام
    order_id = str(uuid.uuid4().int)[:8]

    new_order = {
        "order_id": order_id,
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "address": data.get("address", ""),
        "payment": data.get("payment", ""),
        "cart": data.get("cart", []),
        "subtotal": data.get("subtotal", 0),
        "tax": data.get("tax", 0),
        "total": data.get("total", 0),
        "status": "Pending"
    }

    orders.append(new_order)
    save_file("orders.json", orders)

    return jsonify({"success": True, "order_id": order_id})

# =======================
#  API — جلب بيانات الفاتورة
# =======================
@app.get("/invoice/<oid>")
def get_invoice(oid):
    orders = load_file("orders.json")

    for o in orders:
        if o["order_id"] == oid:
            return jsonify(o)

    return jsonify({"error": "Not found"}), 404

# =======================
#  تشغيل السيرفر
# =======================
if __name__ == "_main_":
    app.run(debug=True, host="127.0.0.1", port=5000)