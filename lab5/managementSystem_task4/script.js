class StoreManager {
    constructor() {
        this.products = new Map();
        this.orders = new Set();
        this.productHistory = new WeakMap();
        this.customers = new WeakSet();
        this.nextId = 1;
    }

    addProduct(name, price, stock) {
        const product = {
            id: this.nextId,
            name: name,
            price: price,
            stock: stock
        };

        this.products.set(this.nextId, product);
        this.productHistory.set(product, [
            {action: "created", date: new Date()}
        ]);

        this.nextId++;
        return product;
    }

    deleteProduct(id) {
        return this.products.delete(id);
    }

    updateProduct(id, newPrice, newStock) {
        const product = this.products.get(id);

        if (!product) {
            return null;
        }

        if (newPrice !== "" && !isNaN(newPrice)) {
            product.price = Number(newPrice);
        }

        if (newStock !== "" && !isNaN(newStock)) {
            product.stock = Number(newStock);
        }

        const history = this.productHistory.get(product);
        history.push({
            action: "updated",
            price: product.price,
            stock: product.stock,
            date: new Date()
        });

        return product;
    }

    searchByName(text) {
        const result = [];
        const lowerText = text.toLowerCase();

        for (const product of this.products.values()) {
            if (product.name.toLowerCase().includes(lowerText)) {
                result.push(product);
            }
        }

        return result;
    }

    makeOrder(customer, productId, quantity) {
        const product = this.products.get(productId);

        if (!product || product.stock < quantity) {
            return null;
        }

        this.customers.add(customer);
        product.stock -= quantity;

        const order = {
            customerName: customer.name,
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            date: new Date()
        };

        this.orders.add(order);

        const history = this.productHistory.get(product);
        history.push({
            action: "ordered",
            quantity: quantity,
            stockLeft: product.stock,
            date: new Date()
        });

        return order;
    }

    getHistory(id) {
        const product = this.products.get(id);

        if (!product) {
            return null;
        }

        return this.productHistory.get(product);
    }
}

const store = new StoreManager();

const nameInput = document.getElementById("nameInput");
const priceInput = document.getElementById("priceInput");
const stockInput = document.getElementById("stockInput");

const updateIdInput = document.getElementById("updateIdInput");
const updatePriceInput = document.getElementById("updatePriceInput");
const updateStockInput = document.getElementById("updateStockInput");

const deleteIdInput = document.getElementById("deleteIdInput");

const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");

const customerInput = document.getElementById("customerInput");
const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantityInput");

const catalog = document.getElementById("catalog");
const log = document.getElementById("log");

document.getElementById("addBtn").addEventListener("click", addProductHandler);
document.getElementById("updateBtn").addEventListener("click", updateProductHandler);
document.getElementById("deleteBtn").addEventListener("click", deleteProductHandler);
document.getElementById("searchBtn").addEventListener("click", searchProductHandler);
document.getElementById("orderBtn").addEventListener("click", orderHandler);

function writeLog(text, type = "info") {
    const div = document.createElement("div");
    div.className = "log-entry " + type;
    div.textContent = new Date().toLocaleTimeString() + " - " + text;
    log.prepend(div);
}

function renderCatalog() {
    catalog.innerHTML = "";
    productSelect.innerHTML = '<option value="">Select product</option>';

    for (const [id, product] of store.products) {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML =
            "<strong>" + product.name + "</strong><br>" +
            "ID: " + id + "<br>" +
            "Price: $" + product.price + "<br>" +
            "Stock: " + product.stock;
        catalog.appendChild(div);

        if (product.stock > 0) {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = product.name + " (ID: " + id + ")";
            productSelect.appendChild(option);
        }
    }
}

function addProductHandler() {
    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const stock = Number(stockInput.value);

    if (name === "" || isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
        writeLog("Invalid product data", "error");
        return;
    }

    const product = store.addProduct(name, price, stock);
    writeLog("Product added: " + product.name, "success");

    nameInput.value = "";
    priceInput.value = "";
    stockInput.value = "";

    renderCatalog();
}

function updateProductHandler() {
    const id = Number(updateIdInput.value);
    const newPrice = updatePriceInput.value;
    const newStock = updateStockInput.value;

    if (isNaN(id)) {
        writeLog("Invalid ID for update", "error");
        return;
    }

    const updated = store.updateProduct(id, newPrice, newStock);

    if (!updated) {
        writeLog("Product not found", "error");
        return;
    }

    writeLog("Product updated: ID " + id, "success");

    updateIdInput.value = "";
    updatePriceInput.value = "";
    updateStockInput.value = "";

    renderCatalog();
}

function deleteProductHandler() {
    const id = Number(deleteIdInput.value);

    if (isNaN(id)) {
        writeLog("Invalid ID for delete", "error");
        return;
    }

    const removed = store.deleteProduct(id);

    if (removed) {
        writeLog("Product deleted: ID " + id, "success");
        deleteIdInput.value = "";
        renderCatalog();
    } else {
        writeLog("Product not found", "error");
    }
}

function searchProductHandler() {
    const text = searchInput.value.trim();
    searchResult.innerHTML = "";

    if (text === "") {
        writeLog("Enter product name for search", "error");
        return;
    }

    const results = store.searchByName(text);

    if (results.length === 0) {
        searchResult.textContent = "No products found";
        writeLog("No search results", "info");
        return;
    }

    for (const product of results) {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML =
            "<strong>" + product.name + "</strong><br>" +
            "ID: " + product.id + "<br>" +
            "Price: $" + product.price + "<br>" +
            "Stock: " + product.stock;
        searchResult.appendChild(div);
    }

    writeLog("Search completed for: " + text, "success");
}

function orderHandler() {
    const customerName = customerInput.value.trim();
    const productId = Number(productSelect.value);
    const quantity = Number(quantityInput.value);

    if (customerName === "" || isNaN(productId) || isNaN(quantity) || quantity <= 0) {
        writeLog("Invalid order data", "error");
        return;
    }

    const customer = {name: customerName};
    const order = store.makeOrder(customer, productId, quantity);

    if (!order) {
        writeLog("Order failed: not enough stock or invalid product", "error");
        return;
    }

    writeLog(
        "Order placed: " + order.customerName +
        ", product: " + order.productName +
        ", quantity: " + order.quantity,
        "success"
    );

    customerInput.value = "";
    quantityInput.value = "";

    renderCatalog();
}

// demo data
store.addProduct("Laptop", 1200, 5);
store.addProduct("Mouse", 25, 20);
store.addProduct("Keyboard", 60, 10);

renderCatalog();
writeLog("System started", "info");