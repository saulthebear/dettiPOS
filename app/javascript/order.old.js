function getCategories() {
  return document.querySelectorAll(".js-category");
}
function getProducts() {
  return document.querySelectorAll(".js-product");
}

function addClickListener(collection, callback) {
  collection.forEach((element) => element.addEventListener("click", callback));
}

function deactivateAllCategories() {
  getCategories().forEach((category) => {
    category.classList.remove("js-active-category", "btn-primary");
    category.classList.add("btn-outline-primary");
  });
}

function setActiveCategory(category) {
  category.classList.add("js-active-category", "btn-primary");
  category.classList.remove("btn-outline-primary");
}

function getActiveCategory() {
  return document.querySelector(".js-active-category");
}

function getCategoryId(category) {
  if (category === null) return null;

  return parseInt(category.dataset.categoryId);
}

function getProductCategories(product) {
  return JSON.parse(product.dataset.ancestors);
}

function activateProduct(product) {
  product.classList.remove("js-active-product");
  product.parentElement.classList.remove("d-none");
}

function deactivateProduct(product) {
  product.classList.add("js-active-product");
  product.parentElement.classList.add("d-none");
}

function deactivateAllProducts() {
  getProducts().forEach(deactivateProduct);
}

function activateAllProducts() {
  getProducts().forEach(activateProduct);
}

function setActiveProducts() {
  const activeCategoryId = getCategoryId(getActiveCategory());

  // If no category is selected, all products are set to active
  if (activeCategoryId === null) {
    activateAllProducts();
    return;
  }

  // Set products who have the active category id in their ancestors as active
  getProducts().forEach((product) => {
    const categories = getProductCategories(product);
    if (categories.includes(activeCategoryId)) {
      activateProduct(product);
    } else {
      deactivateProduct(product);
    }
  });
}

function handleCategoryClick(event) {
  const category = event.currentTarget;

  // Toggle off if already selected
  if (getActiveCategory() === category) {
    deactivateAllCategories();
    setActiveProducts();
    return;
  }

  deactivateAllCategories();
  setActiveCategory(category);

  deactivateAllProducts();
  setActiveProducts();
}

class LineItem {
  constructor(id, name, quantity, unitPrice, notes = "") {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.notes = "";
  }

  increaseQuantity(n) {
    this.quantity += n;
    return this;
  }

  decreaseQuantity(n) {
    this.quantity -= n;
    if (this.quantity < 0) this.quantity = 0;
    return this;
  }

  addOne() {
    this.increaseQuantity(1);
    return this;
  }

  removeOne() {
    this.decreaseQuantity(1);
    return this;
  }
}

class LineItems {
  constructor() {
    this.store = new Map();
  }

  addItem(item) {
    if (this.store.has(item.id)) {
      const existingItem = this.store.get(item.id);
      existingItem.addOne();
    } else {
      this.store.set(item.id, item);
    }
    renderLineItems(lineItemsContainer, lineItems.getList());
  }

  getList() {
    return Array.from(this.store.values());
  }
}

function handleProductClick(event) {
  const product = event.currentTarget;
  const id = parseInt(product.dataset.productId);
  const name = product.dataset.productName;
  const price = parseFloat(product.dataset.productPrice);

  lineItems.addItem(new LineItem(id, name, 1, price));
}

function renderLineItems(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    html = lineItemHtml(item);
    elements = htmlToElements(html);
    elements.forEach((element) => container.appendChild(element));
  });
}

function lineItemHtml(item) {
  const total_price = item.quantity * item.unitPrice;

  const html = `
    <div class="row sv-line-item pt-3">
      <div class="col-6">
        <span class="d-block fw-bold">${item.name}</span>
        <span class="d-block fw-light text-muted">${item.notes}</span>
      </div>

      <div class="col-2">
        <span class="sv-line-item__quantity">${item.quantity}</span>
      </div>

      <div class="col-2">
        <span class="sv-line-item__unit-price">R${item.unitPrice}</span> 
      </div>

      <div class="col-2">
        <span class="fw-bold">R${total_price}</span> 
      </div>
    </div>
  `;

  return html.trim();
}

function htmlToElements(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.childNodes;
}

setActiveProducts();
addClickListener(getCategories(), handleCategoryClick);
addClickListener(getProducts(), handleProductClick);
const lineItems = new LineItems();
const lineItemsContainer = document.querySelector(".line-items");
renderLineItems(lineItemsContainer, lineItems.getList());
